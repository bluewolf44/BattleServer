package com.battleServer

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloTest {
    @GetMapping("")
    fun helloWorld() : String
        = "Hello World"
}