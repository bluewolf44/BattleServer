import { useState } from 'react'
import './InGame.css'

function InGame({HandleBack}) {
    const size = 7;
    const [titleText,setTitleText] = useState("Waiting To Join")
    const [lobbyCode,setLobbyCode] = useState("")
    const [currentPhase,setCurrentPhase] = useState("waiting")

    const handleOnClick = (id) => {
        switch(currentPhase)
        {
            case "waiting":
        }

    }

    return (
        <>
            <h1>{titleText}</h1>
            {(() => {
                const total = [];
                for (let y=0;y<size;y++)
                {
                    const arr = [];
                    for (let x=0; x<size;x++)
                    {
                        arr.push(<button key = {size*y+x} onClick = {() => handleOnClick(size*y+x)} className = "gameBoard"/>);
                    }
                    total.push(
                        <div>
                            {arr}
                        </div>
                    );
                }
                return total;
            })()}
            <p>{"Lobby Code: "+lobbyCode}</p>
            <button onClick = {HandleBack}>Back</button>
        </>
    )
}
export default InGame