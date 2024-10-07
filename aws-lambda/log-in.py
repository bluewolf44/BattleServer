import json
import boto3

s3 = boto3.client('s3')


def lambda_handler(event, context):
    try:
        player = s3.get_object(Bucket='player-storage', Key=event["username"] + ".json")
        player_dict = json.loads(player['Body'].read().decode('utf-8'))
        
        if player_dict["password"] != event["password"]:
            return {
                'statusCode': 401
            }
        
        else:
            player_dict.pop("password")
            return {
                'headers':{
                    'Access-Control-Allow-Origin': '*'
                },    
                'statusCode': 200,
                'body': json.dumps(player_dict)
            }
    except Exception as e:
        return {
            'statusCode': 404
        }
 