package com.battleServer

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import com.battleServer.domains.Player
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

@Service
class PlayerService(val db: PlayerRepository){

    fun save(player: Player)
    {
        db.save(player)
    }

    fun findPlayers(): List<Player> = db.findPlayers()

    //true if found
    fun checkPlayerUserName(userName:String): Boolean
    {
        return db.getByUserName(userName) != null
    }

}

interface PlayerRepository : CrudRepository<Player, Int>
{
    @Query("select * from player")
    fun findPlayers(): List<Player>

    @Query("select * from player where user_name = :userName")
    fun getByUserName(@Param("userName") userName: String): Player?
}