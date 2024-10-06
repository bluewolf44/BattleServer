import { useState } from 'react'

export default function Account({setError,idToLambda}){
    const [accountForm, setAccountForm] = useState(true);
    const [signUp, setSignUp] = useState(true); // true if signUp, False if login
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    const HandleSignUp = async () => {
        if(signUp)
        {
            setAccountForm(!accountForm);
            setSignUp(true);
        } else {
            setSignUp(true);
            setAccountForm(false);
        }
    }

    const HandleSignIn = async () => {
        if(!signUp)
        {
            setAccountForm(!accountForm);
            setSignUp(false);
        } else {
            setSignUp(false);
            setAccountForm(false);
        }
    }


    const HandleChange = async (event) => {
        setUser({...user, 
            [event.target.name]: event.target.value
        })
    }

    const HandleAccount = async (event) => {
        event.preventDefault();
        console.log(user);

        if(signUp)
        {
            try{
                const response = await fetch(`http://${idToLambda}:8080/signUp`, {
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
                });
                if (response.status == 409)
                {
                    setError("Username already exists");
                }
                else if (response.status == 201)
                {
                    setError("Account created");
                }

                console.log(response);
            } catch(error){
                console.error(error.message);
            }
        } else {
            try{
                const response = await fetch(`http://${idToLambda}:8080/login`, {
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
                });
                if (response.status == 404)
                {
                    setError("Username or Password incorrect");
                }
                else if (response.status == 200)
                {
                    setError("Sign In success");
                    setUser(response.json());
                }
                console.log(response);
            } catch(error){
                console.error(error.message);
            }
        }
       
    }

    return(
        <div>
            <form hidden={accountForm}>
                <h2>{signUp ? "Sign Up" : "Login in"}</h2>
                <label htmlFor="username">Username</label>
                <input name="username" id="username" type="text" value = {user.username} onChange={HandleChange}></input>
                <label htmlFor="password">Password</label>
                <input name="password" id="password" type="password" value = {user.password} onChange={HandleChange}></input>
                <button type="submit" onClick={HandleAccount}>{signUp ? "Create Account" : "Login in"}</button>
            </form>
            

            <div id = "AccountsDiv">
                <button className = "AccountButton" onClick={HandleSignUp}>Sign up</button>
                <button className = "AccountButton" onClick={HandleSignIn}>Log in</button>
            </div>
        </div>
    )
}