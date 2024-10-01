package com.battleServer

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

@RestController
@SpringBootApplication
@CrossOrigin(origins = ["http://localhost:5173"])
class BattleServerApplication {

	@GetMapping("")
	fun helloWorld(): String = "Hello World"

	@GetMapping("/createGame", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
	fun createGame(): SseEmitter {
		val size = 7
		var i = 0
		val startingBoard = mutableListOf<Boolean>()
		while(i < size*size) {
			startingBoard.add(false)
			i++
		}
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

		game.hostEmitter.send(GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits))

		return game.hostEmitter;
	}

	@GetMapping("/joinGame/{lobbyCode}")
	fun joinGame(@PathVariable lobbyCode: String) : SseEmitter?
	{
		for (game in GamesRunning)
		{
			if (game.lobbyCode == lobbyCode)
			{
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
			var startGame = false
			if (game.lobbyCode == lobbyCode) {
				if (data.host) {
					game.hostShips = data.board
					startGame = game.currentPhase == "waitingForHost"
					game.currentPhase = "waitingForGuest"
				} else {
					game.guestShips = data.board
					startGame = game.currentPhase == "waitingForGuest"
					game.currentPhase = "waitingForHost"
				}

				// to start game
				if (startGame)
				{
					game.currentPhase = if (Random.nextInt(0, 1) == 0) "hostTurn" else "guestTurn"

					val gameSocket = GameSocket(
						game.lobbyCode,
						game.currentPhase,
						if (game.currentPhase == "hostTurn") game.guestShips else game.hostShips,
						if (game.currentPhase == "hostTurn") game.hostHits else game.guestHits
					)

					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)

					return ResponseEntity.status(HttpStatus.CREATED).body("ShipBoard Updated and Game started")

				}
				else
				{
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
		for (game in GamesRunning) {
			if (game.lobbyCode == lobbyCode) {
				//Checking who turn it is
				if (data.host) {
					game.hostHits[data.id] = true
					var gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.guestShips,game.hostHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)
					game.currentPhase = "guestTurn"
					sleep(3000)
					gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)

				} else {
					game.guestHits[data.id] = true
					var gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.hostShips,game.guestHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)
					game.currentPhase = "hostTurn"
					sleep(3000)
					gameSocket = GameSocket(game.lobbyCode,game.currentPhase,game.guestShips,game.hostHits)
					game.hostEmitter.send(gameSocket)
					game.questEmitter!!.send(gameSocket)
				}
				return ResponseEntity.status(HttpStatus.CREATED).body("ShipBoard Updated")
			}
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lobby not found")
	}


}

fun fireMissile(game: Game, x: Int, y: Int){
	if(x >= 7 || y >= 7){
		// some error handling
	}
}

fun getRandomString(length: Int) : String {
	val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
	return (1..length)
		.map { allowedChars.random() }
		.joinToString("")
}


fun main(args: Array<String>) {
	runApplication<BattleServerApplication>(*args)
}


