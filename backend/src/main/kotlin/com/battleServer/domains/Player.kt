package com.battleServer.domains

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("player")
data class Player(
    @Id
    var playerId:Int?,
    val username:String,
    val password:String,
    val currentWinStreak:Int,
    val highestWinStreak:Int
)
