import { useState } from 'react'
import InGame from './InGame'
import Lobby from './Lobby'
import './App.css'

function App() {
    const [inGame,setInGame] = useState(false);

    const HandleHost = () => {
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
