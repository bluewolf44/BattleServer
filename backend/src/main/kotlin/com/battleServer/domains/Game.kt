package com.battleServer.domains

data class Game(
    val lobbyCode:String,
    val hostBoard:List<Int>,
    val joinBoard:List<Int>,
    val currentTurn:String,
    val host:Player,
    val join:Player)
