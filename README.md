# BattleServer
This project is an online multiplayer battleship game. Players can play without signing up, however, signing up and logging in store the player's current and highest win streaks. Further functionality can be added to display a leaderboard of the users with the highest winstreaks. 

This application is intended to run in the AWS Cloud. The application can be accessed (when running) using this IP: http://52.21.155.9:3000

## Project design
Backend: 
- Created with [SpringBoot](https://spring.io/projects/spring-boot), [gradle](https://gradle.org/), [Kotlin](https://kotlinlang.org)
- Deals with the game and lobby logic (**NOTE**: *DOES NOT* have a connection to any database)

Frontend:
- Created with [Vite](https://vite.dev/), [React.js](https://reactjs.org), [npm](https://www.npmjs.com/)

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

## To get access to the EC2-instances that this project is deployed on
Please use the following AWS guide to generate a key-pair: [Create a key pair for your Amazon EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html)

Make sure that the private key has the `.pem` extension. Please send the public key to one of the other developers working on this project. **NOTE**: Do **NOT** send the private (the file with the `.pem` extension) as sending it over the network is not secure.
## To launch to LocalHost
#### Frontend:
```
cd .\frontend\
npm i
npm run dev
```
React will be on port **3000**

You will have to change the Ip location in App.jsx to your backend IP.

#### Backend:
```
cd .\backend\.
.\gradlew BootRun
```

SpringBoot will run on port **8080**

## To replicate the AWS environment
### Frontend
- Create an EC2 t2.micro instance, using the Amazon Linux image.
- Allow all traffic from HTTP/HTTPS
- Configure the inbound rules of the associated launch wizard to allow Custom TCP connections on port **3000** (this is the port the frontend runs on)
- Connect to the instance
- Run `sudo yum install git`
- Run `sudo yum install npm`
- Run `git clone <battleServerRepo>`
- Change directory into `BattleServer/frontend`
- Run `npm run dev` to start the Vite server

To automatically run the server on every boot, please edit the user data with the following: https://repost.aws/knowledge-center/execute-user-data-ec2 and change the shell commands to be:
```
#!/bin/sh
cd /home/ec2-user/BattleServer/frontend
npm run dev
```

### Backend
- Create an EC2 t2.micro instance, using the Amazon Linux image.
- Allow all traffic from HTTP/HTTPS
- Configure the inbound rules of the associated launch wizard to allow Custom TCP connections on port **8080** (this is the port the frontend connects to)
- Connect to the instance
- Run `sudo yum install git`
- Run `sudo yum install java-21-amazon-corretto-devel`
- Run `git clone <battleServerRepo>`
- Change directory into `BattleServer/backend/build/libs` (this is where the snapshot `.jar` file is)
- Run `sudo java -jar <snapshot>`

Alternatively, if the `.jar` file is not up to date, you can also run the backend by doing the following
- From the home directory, change directory to BattleServer/backend
- Run `sudo chmod 755 gradlew`
- Run `sudo ./gradlew bootRun`

Please note that this method may take a while to boot and/or max out the CPU.

To automatically run the server on every boot, please edit the user data with the following: https://repost.aws/knowledge-center/execute-user-data-ec2 and change the shell commands to be:
```
#!/bin/sh
cd /home/ec2-user/BattleServer/backend/build/libs
java -jar <snapshot>
```

### Lambda functions
- Create a new Lambda function, 'Author from scratch'
- Select Python as the runtime
- Paste the code from one of the `aws-lambda` files in this repo
- Repeat for all the functions

### S3 Bucket
- Create a new 'General purpose' S3 Bucket named "player-storage". **NOTE**: If you use a different name, you will need to update the Lambda functions accordingly
- **NOTE**: Make sure to untick 'Block all public access'
- Leave the rest of the settings as default
- Confirm bucket creation

### API Gateway
- Click 'Create API' in the AWS API Gateway dashboard
- Select REST API
- Click 'Create Resource'
- Enter **one** of the following: /signUp, /logIn, /winStreak under the 'Resource name' field
- Enable CORS and create the resource
- Select the endpoint, and click 'Create method'
- Select 'Method type' POST and 'Integration type' Lambda
- Select the Lambda instance from the drop-down that corresponds to the endpoint
- Create the method
- Check under 'Integration response' that the Access-Control-Allow-Origin is there, if not, create it.
- Test the method to ensure it is calling the Lambda function correctly
