import { useState } from 'react'
import './InGame.css'

function InGame({HandleBack,data}) {
    const boardSize = 7;

    const handleOnClick = (id) => {
        switch(data.currentPhase)
        {
            case "waiting":
            case "shipPlacing":
        }
    }

    let titleText = ""
    switch (data.currentPhase)
    {
        case "waiting":
            titleText = "Waiting for other player...";
            break;
        case "shipPlacing":
            titleText = "Please place your ships";
            break;
    }

    return (
        <>
            <h1>{titleText}</h1>
            <h2>{"Lobby code: "+data.lobbyCode}</h2>
            {(() => {
                const total = [];
                for (let y=0;y<boardSize;y++)
                {
                    const arr = [];
                    for (let x=0; x<boardSize;x++)
                    {
                        arr.push(<button key = {boardSize*y+x} onClick = {() => handleOnClick(size*y+x)} className = "gameBoard"/>);
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