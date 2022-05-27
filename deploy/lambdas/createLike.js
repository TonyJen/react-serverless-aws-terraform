// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "us-east-1" });

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback) {
  let responseCode = 200;
  let responseBody = "";
  const params = {
    TableName: "likes",
    Item: {
      likeId: { S: event.requestContext.requestId },
      identityId: { S: event.requestContext.identity.cognitoIdentityId },
      username: { S: JSON.parse(event.body).username },
      commentId: { S: JSON.parse(event.body).commentId }
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

  // Call the message queue to send the message
  // const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  // const sqsParams = {
  //   MessageBody: JSON.stringify(params),
  //   QueueUrl: "https://sqs.us-east-1.amazonaws.com/918058160524/todo-queue"
  // };
  // sqs.sendMessage(sqsParams, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //     responseCode = 500;
  //     responseBody = err;
  //   } else {
  //     console.log("Success", data);
  //     responseBody = data;
  //   }
  //   const response = {
  //     statusCode: responseCode,
  //     headers: {
  //       "content-type": "application/json",
  //       "Access-Control-Allow-Origin": "*"
  //     },
  //     body: JSON.stringify(responseBody)
  //   };
  //   callback(null, response);
  // });


  // Create a depth first graph traversal
  const graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": [],
    "F": []
  };

  const visited = {};
  const stack = [];

  function dfs(node) {
    if (visited[node]) {
      return;
    }
    visited[node] = true;
    stack.push(node);
    graph[node].forEach(dfs);
  }
  
  dfs("A");
  console.log(stack);
};


// What is the meaning of the following code?
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "us-east-1" });

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback) {
  let responseCode = 200;
  let responseBody = "";
  const params = {
    TableName: "comments",
    Item: {
      commentId: { S: event.requestContext.requestId },
      username: { S: JSON.parse(event.body).username },
      comment: { S: JSON.parse(event.body).comment }
    }
  };

  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      responseCode = 500;
      responseBody = err;
    }
    console.log("Success", data);
    responseBody = data;
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
  );
};








