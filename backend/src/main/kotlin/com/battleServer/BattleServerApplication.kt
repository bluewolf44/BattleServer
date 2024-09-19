package com.battleServer

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BattleServerApplication

fun main(args: Array<String>) {
	runApplication<BattleServerApplication>(*args)
}
