import { useState } from 'react'
import './InGame.css'

function InGame({HandleBack,data,setData,host}) {
    const [forceUpdate,setForceUpdate] = useState(-1)
    const boardSize = 7;

    const handleOnClick = (id) => {
        switch(data.currentPhase)
        {
            case "waiting":
                break;
            case "waitingForGuest":
                if (!host)
                {
                    placeShip(id);
                }
                break;
            case "waitingForHost":
                if (host)
                {
                    placeShip(id);
                }
                break;
            case "shipPlacing":
                placeShip(id);
                break;
        }
    }

    const placeShip = (id) => {
        const temp = data;
        temp.ships[id] = (!temp.ships[id]);
        setForceUpdate(id)
        setData(temp);
    };

    const HandlePlacement = () =>
    {
        fetch('http://localhost:8080/updateBoard/'+data.lobbyCode, {
               method: 'POST',
               body: JSON.stringify({
                   board:data.ships,
                   host:host,
               }),
               headers: {
                 'Content-Type': 'application/json',
               },
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed upload board');
                }
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load properties. Please try again later.');
                setIsLoading(false);
            });
    }


    let titleText = "";
    switch (data.currentPhase)
    {
        case "waiting":
            titleText = "Waiting for other player...";
            break;
        case "shipPlacing":
            titleText = "Please place your ships";
            break;
        case "waitingForHost":
            if (host)
            {
                titleText = "Opponent ready";
                break;
            }
            titleText = "Waiting for opponent";
            break;
        case "waitingForGuest":
            if (host)
            {
                titleText = "Waiting for opponent";
                break;
            }
            titleText = "Opponent ready";
            break;
        case "hostTurn":
            if (host)
            {
                titleText = "Your turn"
            } else {
                titleText = "Opponent turn"
            }
            break;
        case "guestTurn":
            if (host)
            {
                titleText = "Your turn"
            }
            else {
                titleText = "Opponent turn"
            }
            break;
    }

    return (
        <>
            {data.ships != null ? (
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
                                arr.push(<button key = {boardSize*y+x} onClick = {() => handleOnClick(boardSize*y+x)} className = {data.ships[boardSize*y+x] ? "shipBoard":"emptyBoard"}/>);
                            }
                            total.push(
                                <div>
                                    {arr}
                                </div>
                            );
                        }
                        return total;
                    })()}

                    {data.currentPhase == "shipPlacing" || (data.currentPhase == "waitingForHost" && host) || (data.currentPhase == "waitingForGuest" && !host) ? <button onClick = {HandlePlacement}>Confirm placement</button>:<p/>}
                </>) : (<h2> Loading </h2>)
            }
            <button onClick = {HandleBack}>Back</button>
        </>
    )
}
export default InGame