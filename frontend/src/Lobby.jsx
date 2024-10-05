import { useState } from 'react'
import './Lobby.css'

function Lobby({HandleHost,HandleJoin}) {
    const [lobbyCodeInput,setLobbyCodeInput] = useState("")


    return (
        <>
            <h1>Welcome to BattleSever</h1>
            <div id = "ButtonsDiv">
                <div id = "JoinGameDiv">                    
                    <input value={lobbyCodeInput} onChange={(e) => setLobbyCodeInput(e.target.value)} type="text" placeholder="Lobby Code"/>
                    <button onClick={() => HandleJoin(lobbyCodeInput)} id = "JoinButton">Join Game</button>
                </div>
                <p>or</p>
                <button onClick={HandleHost}>Host Game</button>
            </div>
        </>
    )
}
export default Lobby