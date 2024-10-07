import json
import boto3

client = boto3.client('s3')
resource = boto3.resource('s3')


def lambda_handler(event, context):
    try:
        player = client.get_object(Bucket='player-storage', Key=event["userName"] + ".json")
        player_json = player['Body'].read().decode('utf-8')
        player_dict = json.loads(player_json)
        player_dict["currentWinStreak"] = player_dict["currentWinStreak"] + 1
        
        if player_dict["currentWinStreak"] > player_dict["highestWinStreak"]:
            player_dict["highestWinStreak"] = player_dict["currentWinStreak"]
            
        response = json.dumps(player_dict)
        resource.Bucket('player-storage').put_object(Key=event["userName"] + ".json", Body=response)
        return {
            'headers':{
                'Access-Control-Allow-Origin': '*'
            },    
            'statusCode': 200,
            'body': response
        }
    except Exception as e:
        return {
            'statusCode': 404
        }