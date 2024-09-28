package com.battleServer.domains

data class Game(
    var lobbyCode:String,
    var hostHits:List<Boolean>,
    var hostShips:List<Boolean>?,
    var guestHits:List<Boolean>,
    var guestShips:List<Boolean>?,
    var currentTurn:String?,
    var hostIP:String,
    var guestIP:String?,
    var host:Player?,
    var guest:Player?
)
