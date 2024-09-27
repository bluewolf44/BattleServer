function InGame({HandleBack}) {
    const size = 7;

    return (
        <>
            {(() => {
                const total = [];
                for (let y=0;y<size;y++)
                {
                    const arr = [];
                    for (let x=0; x<size;x++)
                    {
                        arr.push(<button key = {size*y+x}/>);
                    }
                    total.push(
                        <div>
                            {arr}
                        </div>
                    );
                }
                return total;
            })()}
            <p>Lobby Code:</p>
            <button onClick = {HandleBack}>Back</button>
        </>
    )
}
export default InGame