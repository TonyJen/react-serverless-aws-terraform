// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const sqs = new AWS.SQS();

// Set the region
AWS.config.update({ region: "us-east-1" });

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback) {
  let responseCode = 200;
  let responseBody = "";
  
  const cognitoIdentityId = event.requestContext.identity.cognitoIdentityId;
  const params = {
    TableName: "todos",
    Item: {
      todoId: { S: event.requestContext.requestId },
      identityId: { S: event.requestContext.identity.cognitoIdentityId },
      username: { S: JSON.parse(event.body).username },
      name: { S: JSON.parse(event.body).name },
      description: { S: JSON.parse(event.body).description }
    }
  };
  
   var body = {
        'todoId': event.requestContext.requestId,
        'identityId': event.requestContext.identity.cognitoIdentityId,
        'name': JSON.parse(event.body).name,
        'description': JSON.parse(event.body).description,
        'source': 'lambda'
    }; 
        
    var msg = { 
        MessageBody: JSON.stringify(body),
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/804360271453/tjen-react-serverless-app-queue'
    };
    
    var statusCode = '200';
    var statusMsg = 'OK';
    
    sqs.sendMessage(msg, function(err, data) {
        if (err) {
            statusCode = '500';
            statusMsg = err;
        }
    }).promise();
  

  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      responseCode = 500;
      responseBody = err;
    } else {
      console.log("Success", data);
      responseBody = data;
    }
    const response = {
      statusCode: responseCode,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(responseBody)
    };
    callback(null, response);
  });
};
