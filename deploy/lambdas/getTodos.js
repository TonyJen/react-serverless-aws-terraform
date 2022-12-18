// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "us-east-1" });

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback) {
  console.log('event', event);
  const cognitoIdentityId = event.requestContext.identity.cognitoIdentityId;
  console.log(cognitoIdentityId)
  const params = {
    TableName: "todos",
    FilterExpression: `identityId = :val`,
    ExpressionAttributeValues: {
      ':val': { S: cognitoIdentityId }
    }
  };

  let responseCode = 200;
  let responseBody = "";

  const scanTable = function() {
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        responseCode = 500;
        responseBody = err;
      } else {
        console.log("Success", data);
        responseBody = data;
        if (typeof data.LastEvaluatedKey != 'undefined') {
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          scanTable();
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
      }
    })
  }

  scanTable()
  
};


