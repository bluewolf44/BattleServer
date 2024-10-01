import { useState } from 'react'
import InGame from './InGame'
import Lobby from './Lobby'
import './App.css'

function App() {
    const [inGame,setInGame] = useState(false);
    const [error,setError] =useState("");
    const [data,setData] = useState({});
    const [host,setHost] = useState(null);
    let eventSource;


    const HandleHost = () => {

        const eventSource = new EventSource('http://localhost:8080/createGame');

        eventSource.onopen = (event) => {
            console.log("connection opened")
        }

        eventSource.onmessage = (event) => {
            setData(JSON.parse(event.data))
            console.log(JSON.parse(event.data));
        };

        eventSource.onerror = (error) => {
            //console.error('EventSource failed:', error.target.readyState);
            console.log(event.target.readyState)
                if (event.target.readyState === EventSource.CLOSED) {
                  console.log('eventsource closed (' + event.target.readyState + ')')
                }
            eventSource.close();
        };

        setInGame(true)
        setHost(true)

        return () => {
            eventSource.close();
        };

    }

    const HandleJoin = async (lobbyCode) => {

        const eventSource = new EventSource('http://localhost:8080/joinGame/'+lobbyCode);

        eventSource.onopen = (event) => {
            console.log("connection opened")
        }

        eventSource.onmessage = (event) => {
            setData(JSON.parse(event.data))
            console.log(data);
        };

        eventSource.onerror = (error) => {
            //console.error('EventSource failed:', error.target.readyState);
            console.log(event.target.readyState)
                if (event.target.readyState === EventSource.CLOSED) {
                  console.log('eventsource closed (' + event.target.readyState + ')')
                }
            eventSource.close();
        };

        setInGame(true)
        setHost(false)

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
                <InGame HandleBack = {HandleBack} data = {data} setData = {setData} host = {host}/>:
                <Lobby HandleHost = {HandleHost} HandleJoin = {HandleJoin}/> }
        </>
    )
}

export default App
