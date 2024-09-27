package com.battleServer.domains

data class Game(
    val lobbyCode:String,
    val hostBoard:List<Int>,
    val guestBoard:List<Int>,
    val currentTurn:String?,
    val hostIP:String,
    val guestIP:String?,
    val host:Player?,
    val guest:Player?
)
