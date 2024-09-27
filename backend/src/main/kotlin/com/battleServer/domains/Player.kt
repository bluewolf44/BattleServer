package com.battleServer.domains

data class Player(
    val playerId:Int,
    val userName:String,
    val password:String,
    val currentWinStreak:Int,
    val highestWinStreak:Int
)
