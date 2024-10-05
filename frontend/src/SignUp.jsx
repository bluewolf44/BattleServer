import { useState } from 'react'

export default function SignUp(){
    const [signUpForm, setSignUpForm] = useState(true);
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    const ToggleSignUp = async () => {
        if(signUpForm){
            setSignUpForm(false);
        }
        else{
            setSignUpForm(true);
        }
    }

    const HandleChange = async (event) => {
        setUser({...user, 
            [event.target.name]: event.target.value
        })
    }

    const HandleSignUp = async (event) => {
        event.preventDefault();
        console.log(user);
        
        try{
            const response = await fetch("http://localhost:8080/signUp", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: user.username,
                    password: user.password,
                    currentWinStreak: 0,
                    highestWinStreak: 0
                })
            })
            console.log(response);
        } catch(error){
            console.error(error.message);
        }
       
    }

    return(
        <div>
            <form hidden={signUpForm}>
                <h2>Sign up</h2>
                <label htmlFor="username">Username</label>
                <input name="username" id="username" type="text" onChange={HandleChange}></input>
                <label htmlFor="password">Password</label>
                <input name="password" id="password" type="password" onChange={HandleChange}></input>
                <button type="submit" onClick={HandleSignUp}>Confirm</button>
            </form>
            

            <div id = "AccountsDiv">
                <button className = "AccountButton" onClick={ToggleSignUp}>Sign up</button>
                <button className = "AccountButton">Log in</button>
            </div>
        </div>
    )
}