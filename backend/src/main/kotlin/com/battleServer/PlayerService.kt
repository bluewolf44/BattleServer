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
    fun checkPlayerUserName(username:String): Boolean
    {
        return db.getByUserName(username) != null
    }

    fun findPlayer(userName: String,password:String): Player? = db.getByUserNameAndPassword(userName,password)

    fun getByUserName(username: String) : Player? = db.getByUserName(username)

    fun updateCurrentWinSteak(username: String):Boolean
    {
        val player = db.getByUserName(username) ?: return false
        db.updateCurrentWinSteak(username, player.currentWinStreak)
        if (player.currentWinStreak >= player.highestWinStreak)
        {
            db.updateHighestWinSteak(username, player.currentWinStreak)
        }
        return true
    }

}

interface PlayerRepository : CrudRepository<Player, Int>
{
    @Query("select * from player")
    fun findPlayers(): List<Player>

    @Query("select * from player where username = :username")
    fun getByUserName(@Param("username") username: String): Player?

    @Query("select * from player where username = :username and password = :password")
    fun getByUserNameAndPassword(@Param("username") username: String,@Param("password") password: String): Player?

    @Query("Update player set current_win_streak = :winSteak where username = :username")
    fun updateCurrentWinSteak(@Param("username") username: String,@Param("winSteak") winSteak: Int)

    @Query("Update player set highest_win_streak = :winSteak where username = :username")
    fun updateHighestWinSteak(@Param("username") username: String,@Param("winSteak") winSteak: Int)
}