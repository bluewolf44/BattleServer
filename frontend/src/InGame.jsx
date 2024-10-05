import { useState } from 'react'
import './InGame.css'

function InGame({HandleBack,data,setData,host,hasShot,setHasShot}) {
    const [forceUpdate,setForceUpdate] = useState(-1); //To forceUpdate the page using in boardPlacement
    const boardSize = 7;


    // When the button of the board is pressed
    // uses the currentPhase look into backend as well
    const handleOnClick = (id) => {
        switch(data.currentPhase)
        {
            case "waitingForGuest":
                //Placing ships only on guest
                if (!host)
                {
                    placeShip(id);
                }
                break;
            case "waitingForHost":
                //Placing ships only on host
                if (host)
                {
                    placeShip(id);
                }
                break;
            case "shipPlacing":
                placeShip(id);
                break;
            case "hostTurn":
                //host can try to hit a ship
                if (host)
                {
                    setHit(id);
                }
                break;
            case "guestTurn":
                //guest can try to gu a ship
                if (!host)
                {
                    setHit(id);
                }
                break;
            default:
                break;
        }
    }

    //Places ship only in placement phase
    const placeShip = (id) => {
        const temp = data;
        temp.ships[id] = (!temp.ships[id]);
        //Using forceUpdate as it don't work without
        setForceUpdate(id);
        setData(temp);
    };

    //Will only work on that client turn
    const setHit = (id) => {
        if (hasShot)
        {
            return;
        }
        setHasShot(true);

        fetch('http://localhost:8080/setHit/'+data.lobbyCode, {
           method: 'POST',
           body: JSON.stringify({//Using hitUpdate in backend for object
               id:id,
               host:host,
           }),
           headers: {
             'Content-Type': 'application/json',
           },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed upload board');
                setHasShot(false);
            }
        })
        .catch((err) => {
            console.error(err);
            setError('Failed to load properties. Please try again later.');
            setIsLoading(false);
            setHasShot(false);
        });
    };

    //Run on acceptance of placement
    const HandlePlacement = () =>
    {
        fetch('http://localhost:8080/updateBoard/'+data.lobbyCode, {
               method: 'POST',
               body: JSON.stringify({// using BoardUpdate in backend for object
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
            });
    }

    //Setting the tile depending on what phase it is
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
            if (host)//true if host, false if guest
            {
                titleText = "Opponent ready";
                break;
            }
            titleText = "Waiting for opponent";
            break;
        case "waitingForGuest":
            if (!host)//true if host, false if guest
            {
                titleText = "Opponent ready";
                break;
            }
            titleText = "Waiting for opponent";
            break;
        case "hostTurn":
            if (host)//true if host, false if guest
            {
                titleText = "Your turn"
            } else {
                titleText = "Opponent turn"
            }
            break;
        case "guestTurn":
            if (! host)//true if host, false if guest
            {
                titleText = "Your turn"
            }
            else {
                titleText = "Opponent turn"
            }
            break;

        case "hostDisconnected":
        case "guestDisconnected":
            titleText = "Opponent Disconnected waiting for rejoin";
            break;

        case "hostWin":
             if (host)//true if host, false if guest
            {
                titleText = "You Win :)"
            } else {
                titleText = "You Lose :("
            }
            break;
        case "guestWin":
             if (!host)//true if host, false if guest
            {
                titleText = "You Win :)"
            } else {
                titleText = "You Lose :("
            }
            break;

    }

    //used to create the buttons for the game board
    const createButtons = () => {
        const total = [];
        for (let y=0;y<boardSize;y++)
        {
            const arr = [];
            for (let x=0; x<boardSize;x++)
            {
                let className = ""
                const id = boardSize*y+x
                //On your turn
                if (data.hits[id])
                {
                    if (data.ships[id])
                    {
                        className = "hitBoard"
                    }
                    else {
                        className = "missBoard"
                    }
                }else{
                    //only displays ships if it your turn or in placement
                    if (data.ships[id] && ((!host && data.currentPhase == "hostTurn") || (host && data.currentPhase == "guestTurn") || data.currentPhase == "shipPlacing" || data.currentPhase == "waitingForHost" || data.currentPhase == "waitingForGuest") )
                    {
                        className = "shipBoard"
                    }
                    else {
                        className = "emptyBoard"
                    }
                }

                arr.push(<button key = {boardSize*y+x} onClick = {() => handleOnClick(boardSize*y+x)} className = {className}/>);
            }
            total.push(
                <div>
                    {arr}
                </div>
            );
        }
        return total;
    }

    return (
        <>
            {data.ships != null ? (
                <>
                    <h1>{titleText}</h1>
                    <h2>{"Lobby code: "+data.lobbyCode}</h2>
                    {createButtons()}

                    {data.currentPhase == "shipPlacing" || (data.currentPhase == "waitingForHost" && host) || (data.currentPhase == "waitingForGuest" && !host) ? <button onClick = {HandlePlacement}>Confirm placement</button>:<p/>}
                </>) : (<h2> Loading </h2>)
            }
            <button onClick = {HandleBack}>Back</button>
        </>
    )
}
export default InGame