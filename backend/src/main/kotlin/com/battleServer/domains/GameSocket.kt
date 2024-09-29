package com.battleServer.domains

data class GameSocket(
    val lobbyCode:String,
    val currentPhase:String,
    val ships:List<Boolean>,
    val hits:List<Boolean>)
