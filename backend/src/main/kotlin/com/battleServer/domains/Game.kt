package com.battleServer.domains

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

data class Game(
    var lobbyCode:String,
    var hostHits:List<Boolean>,
    var hostShips:List<Boolean>,
    var guestHits:List<Boolean>,
    var guestShips:List<Boolean>,
    var currentPhase:String,
    var host:Player?,
    var guest:Player?,
    var hostEmitter:SseEmitter,
    var questEmitter:SseEmitter?
)
