package com.battleServer.domains

data class Game(
    val lobbyCode:String,
    val hostHits:List<Boolean>,
    val hostShips:List<Boolean>,
    val guestHits:List<Boolean>,
    val guestBoard:List<Boolean>,
    val currentTurn:String?,
    val hostIP:String,
    val guestIP:String?,
    val host:Player?,
    val guest:Player?
)
