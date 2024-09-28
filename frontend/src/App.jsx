import { useState } from 'react'
import InGame from './InGame'
import Lobby from './Lobby'
import './App.css'

function App() {
    const [inGame,setInGame] = useState(false);

    const HandleHost = async () => {
        await fetch("http://localhost:8080/createGame", {
            method:"POST",
            headers: {
                //"Content-Type": "application/json",
            },
            //credentials: "same-origin",
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch properties');
            }
            return res.json();
        }).then((data) => {
            console.log(data)
        })


        setInGame(true)
    }

    const HandleBack = () => {
        setInGame(false)
    }

    return (
        <>
            {inGame ?
                <InGame HandleBack = {HandleBack}/>:
                <Lobby HandleHost = {HandleHost}/> }
        </>
    )
}

export default App
