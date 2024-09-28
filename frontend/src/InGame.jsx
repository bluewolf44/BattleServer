import { useState } from 'react'
import './InGame.css'

function InGame({HandleBack}) {
    const boardSize = 7;
    const [titleText,setTitleText] = useState("Waiting for other player...")
    const [lobbyCode,setLobbyCode] = useState("")

    return (
        <>
            <h1>{titleText}</h1>
            <h2>{"Lobby code: "+lobbyCode}</h2>
            {(() => {
                const total = [];
                for (let y=0;y<boardSize;y++)
                {
                    const arr = [];
                    for (let x=0; x<boardSize;x++)
                    {
                        arr.push(<button key = {boardSize*y+x} className = "gameBoard"/>);
                    }
                    total.push(
                        <div>
                            {arr}
                        </div>
                    );
                }
                return total;
            })()}
            <button onClick = {HandleBack}>Back</button>
        </>
    )
}
export default InGame