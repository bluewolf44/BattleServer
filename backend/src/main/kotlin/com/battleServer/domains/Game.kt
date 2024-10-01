package com.battleServer.domains

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

data class Game(
    var lobbyCode:String,
    var hostHits: MutableList<Boolean>,
    var hostShips: MutableList<Boolean>,
    var guestHits: MutableList<Boolean>,
    var guestShips: MutableList<Boolean>,
    var currentPhase:String,
    var host:Player?,
    var guest:Player?,
    var hostEmitter:SseEmitter,
    var questEmitter:SseEmitter?
)
