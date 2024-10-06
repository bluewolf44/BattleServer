import { useState,useRef,useEffect } from 'react'
import InGame from './InGame'
import Lobby from './Lobby'
import SignUp from './SignUp'
import './App.css'

function App() {
    //Display lobby or inGame
    const [inGame,setInGame] = useState(false);
    //If theres an error
    const [error,setError] =useState("");
    //All data get from a sse from backend to a EventSource
    const [data,setData] = useState({});
    //If user is host:true or joins using lobbyCode:false
    const [host,setHost] = useState(null);
    //Checking if has shot this turn
    const [hasShot,setHasShot] = useState(false);
    //The current Ship being placed
    const [currentPlacement,setCurrentPlacement] = useState({});
    const idToBackEnd = "35.174.65.31"


    let shipBoard = useRef();

    useEffect(() => {
      shipBoard.current = data.ships;
    }, [data]);


    const HandleHost = async () => {
        //Creating the sse link using this EventSource
        const eventSource = new EventSource(`http://${idToBackEnd}:8080/createGame`);

        eventSource.onopen = async (event) => {
            console.log("connection opened");
            setInGame(true);
            setHost(true);
            setCurrentPlacement({currentShip:0,rotation:false});
        }

        eventSource.onmessage = (event) => {
            const temp = JSON.parse(event.data);
            if (temp.currentPhase == "waitingForHost" || temp.currentPhase == "waitingForGuest")
            {
                temp.ships = shipBoard.current;
            }
            if(temp.currentPhase == "guestTurn")
            {
                setHasShot(false);
            }

            setData(temp);
            console.log(temp);
        };

        eventSource.onerror = (error) => {
            console.log(event.target.readyState)
                if (event.target.readyState === EventSource.CLOSED) {
                  console.log('eventsource closed (' + event.target.readyState + ')')
                }
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };

    }

    const HandleJoin = async (lobbyCode) => {
        //Creating the sse link using this EventSource
        const eventSource = new EventSource(`http://${idToBackEnd}:8080/joinGame/`+lobbyCode);

        eventSource.onopen = (event) => {
            console.log("connection opened");
            setInGame(true);
            setHost(false);
            setCurrentPlacement({currentShip:0,rotation:false});
        }

        eventSource.onmessage = (event) => {
            const temp = JSON.parse(event.data);
            if (temp.currentPhase == "waitingForHost" || temp.currentPhase == "waitingForGuest")
            {
                temp.ships = shipBoard.current;
            }

            if(temp.currentPhase == "hostTurn")
            {
                setHasShot(false);
            }

            setData(temp);
            console.log(temp);
        };

        eventSource.onerror = (error) => {
            //console.error('EventSource failed:', error.target.readyState);
            console.log(event.target.readyState)
                if (event.target.readyState === EventSource.CLOSED) {
                  console.log('eventsource closed (' + event.target.readyState + ')')
                }
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }

    const HandleBack = async () => {
        setInGame(false)
    }

    return (
        <>
            {inGame ?
                <InGame
                    HandleBack = {HandleBack}
                    data = {data}
                    setData = {setData}
                    host = {host}
                    hasShot = {hasShot}
                    setHasShot = {setHasShot}
                    currentPlacement = {currentPlacement}
                    setCurrentPlacement = {setCurrentPlacement}
                    idToBackEnd = {idToBackEnd}
                />:
                <Lobby HandleHost = {HandleHost} HandleJoin = {HandleJoin}/> }
                <SignUp setError={setError} />
                <p>{error}</p>
        </>
    )
}

export default App
