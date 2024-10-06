package com.battleServer.domains

data class Player(
    val username:String,
    val password:String,
    val currentWinStreak:Int,
    val highestWinStreak:Int
)
