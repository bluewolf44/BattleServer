package com.battleServer

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import com.battleServer.domains.Player

@Service
class PlayerService(val db: JdbcTemplate){
    fun findPlayers(): List<Player> = db.query("select * from player") { response, _ ->
        Player(response.getInt("player_id"), response.getString("username"), 
        response.getString("player_password"), response.getInt("current_winstreak"), 
        response.getInt("highest_winstreak"))
    }

}