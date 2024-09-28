package com.battleServer

import com.battleServer.domains.Game
import jakarta.servlet.http.HttpServletRequest
import org.springframework.boot.runApplication

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

val GamesRunning = mutableListOf<Game>()

@RestController
@SpringBootApplication
@CrossOrigin(origins = ["http://localhost:5173"])
class BattleServerApplication {

	@GetMapping("")
	fun helloWorld(): String = "Hello World"

	@PostMapping("/createGame")
	fun createGame(request: HttpServletRequest): String {
		val size = 7;
		var i = 0;
		var startingBoard = mutableListOf<Boolean>()
		while(i < size*size) {
			startingBoard.add(false)
			i++;
		}
		val lobbyCode = getRandomString(16)
		GamesRunning.add(Game(lobbyCode, startingBoard, null, startingBoard, null, "SetUp", request.remoteAddr, null, null, null))
		return lobbyCode
	}

	@PostMapping("/joinGame/{lobbyCode}")
	fun joinGame(@PathVariable lobbyCode: String,request: HttpServletRequest) : ResponseEntity<String>
	{
		for (game in GamesRunning)
		{
			if (game.lobbyCode == lobbyCode)
			{
				game.guestIP = request.remoteAddr
				return ResponseEntity.status(HttpStatus.CREATED).body("Joined")
			}
		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not Found")

	}
}

fun submitShipPlacement(placement: bool[][]){

}

fun fireMissile(game: Game, x: int, y: int){
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


