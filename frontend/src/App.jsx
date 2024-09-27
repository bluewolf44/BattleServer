import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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
        </>
    )
}

export default App
