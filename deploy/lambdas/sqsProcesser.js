const AWS = require("aws-sdk");
const sqs = new AWS.SQS();


// Set the region
AWS.config.update({ region: "us-east-1" });


// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async function(event, context, callback) {
  let responseCode = 200;
  let responseBody = "";
  console.log(event.Records);
  
  event.Records.forEach(record => {
    const { body } = record;
    console.log(body);
    console.log(JSON.parse(body).todoId)

    const params = {
      TableName: "sqsRequests",
      Item: {
        todoId: { S: JSON.parse(body).todoId },
        identityId: { S: JSON.parse(body).identityId },
        name: { S: JSON.parse(body).name },
        description: { S: JSON.parse(body).description },
        source: { S: JSON.parse(body).source }
      }
    };
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
    });
  });

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