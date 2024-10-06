# BattleServer
This project is an online multiplayer battleship game. Players can play without signing up, however, signing up and logging in store the player's current and highest win streaks. Further functionality can be added to display a leaderboard of the users with the highest winstreaks. 

This application is intended to run in the AWS Cloud.

## Project design
Backend: 
- Created with SpringBoot, gradle, Kotlin
- Deals with the game and lobby logic (**NOTE**: *DOES NOT* have a connection to any database)

Frontend:
- Created with Vite, React, npm

### AWS services
- There are two **EC2 instances**, one for the frontend, one for the backend (with an *Elastic IP* to allow frontend to connect over its public IP)
- An **API Gateway** called BattleServer-API that allows the frontend to send requests to /signUp, /logIn, /winStreak
- An **S3 Bucket** called player-storage to store the players' information
- The following **Lambda functions** written in Python and using boto3:
  - *add-player* - Adds a player to *player-storage*
  - *log-in* - Checks that credentials are valid, and returns the player object from the *player-storage*, minus the password.
  - *update-win-streak* - Updates the current winstreak of the player, and the highest winstreak if it has been broken in *player-storage*

### API Gateway to Lambda links
- /signUp triggers the *add-player* Lambda function
- /logIn triggers the *log-in* Lambda function
- /winStreak triggers the *update-win-streak* Lambda function

