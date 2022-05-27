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
    TableName: "comments",
    Item: {
      commentId: { S: event.requestContext.requestId },
      identityId: { S: event.requestContext.identity.cognitoIdentityId },
      username: { S: JSON.parse(event.body).username },
      content: { S: JSON.parse(event.body).content },
      todoId: { S: JSON.parse(event.body).todoId }
    }
  };


  // call db service to create a new comment
  ddb.putItem(params, function(err, data) {
    if (err) {
      responseCode = 500;
      responseBody = JSON.stringify(err);
    } else {
      responseBody = JSON.stringify(data);
    }
    const response = {
      statusCode: responseCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: responseBody
    };
    callback(null, response);
  });
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
};

// Create a AWS SAM template
// {
//   "AWSTemplateFormatVersion": "2010-09-09",
//   "Description": "AWS Lambda Function",
//   "Resources": {
//     "CreateComment": {
//       "Type": "AWS::Lambda::Function",
//       "Properties": {
//         "Code": {
//           "S3Bucket": "todo-bucket",
//           "S3Key": "lambdas/createComment.js"
//         },
//         "Handler": "createComment.handler",


//         "Role": {
//           "Fn::GetAtt": [
//             "LambdaExecutionRole",
//             "Arn"
//           ]
//         },
//         "Runtime": "nodejs8.10",
//         "Timeout": 300,
//         "MemorySize": 128,
//         "Environment": {
//           "Variables": {
//             "TABLE_NAME": "comments"
//           }
//         }
//       }
//     }
//   }
// }


// Create a CDK app
const app = new cdk.App();


// Create a new Lambda function
const createComment = new lambda.Function(
  app,
  "CreateComment",
  {
    code: new lambda.AssetCode("lambdas/createComment.js"),
    handler: "createComment.handler",
    runtime: lambda.Runtime.NODEJS_10_X,
    timeout: 300,
    memorySize: 128,
    environment: {
      TABLE_NAME: "comments"
    }
  }
);

// add to s3 bucket
const bucket = new s3.Bucket(app, "todo-bucket");


// Create a new DynamoDB table
const comments = new dynamodb.Table(app, "comments", {
  partitionKey: { name: "commentId", type: dynamodb.AttributeType.STRING },
  tableName: "comments",
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
});


































// what is first principle?
// what is second principle?
// what is third principle?
// what is fourth principle?
// what is fifth principle?
// what is sixth principle?
// what is seventh principle?
// what is eighth principle?
// what is ninth principle?

// What is first princple of programming?
1. Understand the problem
2. Identify the inputs and outputs
3. Identify the rules
4. Identify the constraints
5. Identify the assumptions
6. Identify the design
7. Identify the implementation
8. Identify the testing
9. Identify the deployment
10. Identify the maintenance
11. Identify the evolution
12. Identify the future




