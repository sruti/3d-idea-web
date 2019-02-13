import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('data-table')

def format_response(status_code, body):
    response = {
        "statusCode": status_code,
        "headers": {
                "Access-Control-Allow-Credentials": True,
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        "body": json.dumps(body)
    }
    return response

def get_data(event, context):   
    response = table.get_item(Key={"dataId": "1"})
    data = response.get("Item")
    return format_response(200, data)

def store_data(event, context):
    item = json.loads(event.get('body'))
    item["dataId"] = "1"
    response = table.put_item(Item=item)
    return format_response(200, "Stored the data")
