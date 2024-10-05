package com.battleServer

import com.battleServer.PlayerService
import com.battleServer.domains.Player
import com.battleServer.domains.BoardUpdate
import com.battleServer.domains.Game
import com.battleServer.domains.GameSocket
import com.battleServer.domains.hitUpdate
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.lang.Thread.sleep
import kotlin.random.Random


val GamesRunning = mutableListOf<Game>()


const val delayBetweenTurns:Long = 3000 //in ms
const val boardSize = 7 //x&y


@RestController
@SpringBootApplication
@CrossOrigin(origins = ["http://localhost:5173"])
class BattleServerApplication(val service: PlayerService) {

	@GetMapping("/db")
	fun index(): List<Player> = service.findPlayers()

	@GetMapping("")
	fun helloWorld(): String = "Hello World"

	@GetMapping("/createGame", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
	fun createGame(): SseEmitter {
		//Creates a boardSize^2 list with all false
		var i = 0
		val startingBoard = mutableListOf<Boolean>()
		while(i < boardSize*boardSize) {
			startingBoard.add(false)
			i++
		}
		//create the game being played
		val game = Game(getRandomString(16), startingBoard.toMutableList(), startingBoard.toMutableList(), startingBoard.toMutableList(), startingBoard.toMutableList(), "waiting",  null, null,SseEmitter(Long.MAX_VALUE),null)
		GamesRunning.add(game)

		game.hostEmitter.onError {
			if (game.currentPhase == "guestDisconnected")
			{
				GamesRunning.remove(game)
			} else {
				game.currentPhase = "hostDisconnected"
				game.questEmitter!!.send(GameSocket(game.lobbyCode, game.currentPhase, game.guestShips, game.hostHits))
			}
		}
		//sends a init message
		game.hostEmitter.send(GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits))

		return game.hostEmitter;
	}

	@GetMapping("/joinGame/{lobbyCode}")
	fun joinGame(@PathVariable lobbyCode: String) : SseEmitter?
	{
		//Finds game using lobbyCode
		for (game in GamesRunning)
		{
			if (game.lobbyCode == lobbyCode)
			{
				//Creates another Emitter
				game.questEmitter = SseEmitter(Long.MAX_VALUE)

				game.questEmitter!!.onError {
					if (game.currentPhase == "hostDisconnected")
					{
						GamesRunning.remove(game)
					} else {
						game.currentPhase = "guestDisconnected"
						game.hostEmitter.send(GameSocket(game.lobbyCode, game.currentPhase, game.guestShips, game.hostHits))
					}
				}

				//Set shipPlacement and sent this to both clients
				game.currentPhase = "shipPlacing"
				game.hostEmitter.send(GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits))
				game.questEmitter!!.send(GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits))

				return game.questEmitter!!
			}
		}
		return null
	}

	//For placing ships
	@PostMapping("updateBoard/{lobbyCode}")
	fun updateBoard(@PathVariable lobbyCode: String,@RequestBody data:BoardUpdate) :  ResponseEntity<String>
		{
		for (game in GamesRunning) {
			//Checking if both client are done
			var startGame = false
			if (game.lobbyCode == lobbyCode) {
				//checking which client is making the request
				if (data.host) {
					game.hostShips = data.board
					//Checking if Host is done
					startGame = game.currentPhase == "waitingForHost"
					game.currentPhase = "waitingForGuest"
				} else {
					game.guestShips = data.board
					//Checking if Guest is done
					startGame = game.currentPhase == "waitingForGuest"
					game.currentPhase = "waitingForHost"
				}

				// to start game
				if (startGame)
				{
					//Get random number to see who starts
					game.currentPhase = if (Random.nextInt(0, 2) == 0) "hostTurn" else "guestTurn"

					//Set board for game
					val gameSocket = GameSocket(
						game.lobbyCode,
						game.currentPhase,
						if (game.currentPhase == "hostTurn") game.guestShips else game.hostShips,
						if (game.currentPhase == "hostTurn") game.hostHits else game.guestHits
					)
					//Starting send
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)

					return ResponseEntity.status(HttpStatus.CREATED).body("ShipBoard Updated and Game started")

				}
				else
				{
					//tells client that the other one is ready
					game.hostEmitter.send(GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.hostHits))
					game.questEmitter!!.send(GameSocket(game.lobbyCode,game.currentPhase,game.guestShips,game.guestHits))
				}
				return ResponseEntity.status(HttpStatus.CREATED).body("ShipBoard Updated")
			}
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lobby not found")
	}
	//For updating a hit
	@PostMapping("setHit/{lobbyCode}")
	fun setHit(@PathVariable lobbyCode: String,@RequestBody data:hitUpdate) : ResponseEntity<String> {
		//Finding game using lobbyCode
		for (game in GamesRunning) {
			if (game.lobbyCode == lobbyCode) {
				//Checking who turn it is
				if (data.host) {
					game.hostHits[data.id] = true
					//sending the updated board to both clients
					var gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.guestShips,game.hostHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)
					//Swapping turns
					game.currentPhase = "guestTurn"
					//Checking if won
					if (checkWin(game.guestShips,game.hostHits))
					{
						game.currentPhase = "hostWin"
					}
					//Sleeping to give time to display where the hit landed
					sleep(delayBetweenTurns)
					//sending updates
					gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)

				} else {
					game.guestHits[data.id] = true
					//sending the updated board to both clients
					var gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)
					//Swapping turns
					game.currentPhase = "hostTurn"
					if (checkWin(game.hostShips,game.guestHits))
					{
						game.currentPhase = "guestWin"
					}
					//Sleeping to give time to display where the hit landed
					sleep(delayBetweenTurns)
					//sending the updated board to both clients
					gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)
				}
				return ResponseEntity.status(HttpStatus.CREATED).body("ShipBoard Updated")
			}
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lobby not found")
	}
}

//only if all ships have been hit.
fun checkWin(ships:MutableList<Boolean>,hits:MutableList<Boolean>):Boolean
{
	var i = 0
	while (i < hits.size)
	{
		if (ships[i] && !hits[i])
		{
			return false
		}
		i++
	}
	return true
}

//Used for lobbyCode to get random code
//Note there could be duplicates
fun getRandomString(length: Int) : String {
	val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
	return (1..length)
		.map { allowedChars.random() }
		.joinToString("")
}


fun main(args: Array<String>) {
	runApplication<BattleServerApplication>(*args)
}


