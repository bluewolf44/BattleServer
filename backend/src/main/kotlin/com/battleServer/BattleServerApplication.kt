package com.battleServer

import org.springframework.boot.runApplication

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@SpringBootApplication
class BattleServerApplication {
	@GetMapping("")
	fun helloWorld() : String  = "Hello World"

}

fun main(args: Array<String>) {
	runApplication<BattleServerApplication>(*args)
}


