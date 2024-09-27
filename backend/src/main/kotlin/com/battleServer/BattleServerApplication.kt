package com.battleServer

import com.battleServer.domains.Game
import jakarta.servlet.http.HttpServletRequest
import org.springframework.boot.runApplication

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@SpringBootApplication
class BattleServerApplication {
	@GetMapping("")
	fun helloWorld(): String = "Hello World"

	@PostMapping("/createGame")
	fun createGame(request: HttpServletRequest): Game {
		return Game(getRandomString(16), listOf(1), listOf(1), "SetUp", request.remoteAddr, null, null, null)

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


