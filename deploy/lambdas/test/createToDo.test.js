const createTodo = require("../createTodo");
const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk")

describe("createTodo", () => {
  beforeEach(() => {
    AWS.config.update({ region: 'us-east-1' });
    AWSMock.mock("DynamoDB", "putItem", (params, callback) => {
      const response = {
        statusCode: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ message: "Todo created successfully" })
      };
      callback(null, response);
    });
  });

  afterEach(() => {
    AWSMock.restore("DynamoDB");
  });

  it("should return success message when todo is created", () => {
    const event = {
      body: JSON.stringify({
        todoId: "123",
        todoName: "Example Todo",
      }),
      requestContext: {
        identity: {
          cognitoIdentityId: "123"
        }
      }
    };
    const context = {};
    const callback = (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual('{"message":"Todo created successfully"}');
    };

    createTodo.handler(event, context, callback);
  });
});