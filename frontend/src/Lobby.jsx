import './Lobby.css'

function Lobby({HandleHost}) {

    return (
        <>
            <h1>Welcome to BattleSever</h1>
            <div>
                <input type="text" placeholder="Lobby Code"/>
                <button id = "JoinButton">Join Game</button>
            </div>
            <div id = "HostDiv">
                <button onClick={HandleHost}>Host Game</button>
            </div>
            <div>
                <button className = "AccountButton">Sign Up</button>
                <button className = "AccountButton">Login in</button>
            </div>
        </>
    )
}
export default Lobby