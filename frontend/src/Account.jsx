import { useState } from 'react'

export default function Account({setError,idToLambda,user,setUser}){
    const [accountForm, setAccountForm] = useState(true);
    const [signUp, setSignUp] = useState(true); // true if signUp, False if login
    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");

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

    const HandleAccount = async (event) => {
        event.preventDefault();
        console.log(user);

        if(signUp)
        {
            try{
                const response = await fetch(`https://${idToLambda}/signUp`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        currentWinStreak: 0,
                        highestWinStreak: 0
                    })
                });
                if (response.status == 409)
                {
                    setError("Username already exists");
                }
                else if (response.status == 200)
                {
                    setError("Account created");
                }

                console.log(response);
            } catch(error){
                console.error(error.message);
            }
        } else {
            await fetch(`https://${idToLambda}/logIn`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then((res) => {
                if (res.status == 404)
                {
                    setError("Username or Password incorrect");
                }
                else if (res.status == 400){
                    setError("Bad request");
                }
                else if (res.status == 200)
                {
                    setError("Sign In success");
                }
                console.log(res);
                return res.json();
            }).then((data) => {
                console.log(JSON.parse(data.body))
                setUser(JSON.parse(data.body));
            }).catch((err) => {
                console.error(err);
                setError('Failed to load properties. Please try again later.');
            });
        }
       
    }

    return(
        <div>
            {user == null ? <p/> :
                <div id = "PlayerDiv">
                    <p>{"Hello " + user.username}</p>
                    <p>{"Your Current winStreak is " + user.currentWinStreak}</p>
                    <p>{"Your Current winStreak is " + user.highestWinStreak}</p>
                </div>
            }
            <form hidden={accountForm}>
                <h2>{signUp ? "Sign Up" : "Login in"}</h2>
                <label htmlFor="username">Username</label>
                <input name="username" id="username" type="text" value = {username} onChange={(e) => setUsername(e.target.value)}></input>
                <label htmlFor="password">Password</label>
                <input name="password" id="password" type="password" value = {password} onChange={(e) => setpassword(e.target.value)}></input>
                <button type="submit" onClick={HandleAccount}>{signUp ? "Create Account" : "Login in"}</button>
            </form>
            

            <div id = "AccountsDiv">
                <button className = "AccountButton" onClick={HandleSignUp}>Sign up</button>
                <button className = "AccountButton" onClick={HandleSignIn}>Log in</button>
            </div>
        </div>
    )
}