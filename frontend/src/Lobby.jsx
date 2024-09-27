function Lobby({HandleHost}) {

    return (
        <>
            <h1>Welcome to BattleSever</h1>
            <div>
                <label>Join Game:</label>
                <input type="text"/>
            </div>
            <div>
                <button onClick={HandleHost}>Host Game</button>
            </div>
        </>
    )
}
export default Lobby