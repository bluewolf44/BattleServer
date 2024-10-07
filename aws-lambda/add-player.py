import json
import boto3

resource = boto3.resource('s3')
client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        player = client.get_object(Bucket='player-storage', Key=event["username"] + ".json")
        return{
            'statusCode': 400
        }
    except Exception as e:
        try:
            resource.Bucket('player-storage').put_object(Key=event["username"] + ".json", Body=json.dumps(event))
        
            return {
                'statusCode': 201,
                'body': json.dumps(event)
            }
        
        except Exception as e:
            return {
                'statusCode': 400
            }