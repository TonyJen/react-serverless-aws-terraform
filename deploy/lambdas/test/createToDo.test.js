const createTodo = require('./createTodo.js');

// Mocked SQS sendMessage function
const mockSendMessage = jest.fn((params, callback) => {
  if (params.MessageBody === 'success') {
    callback(null, 'Success');
  } else {
    callback('Failure');
  }
});

// Mocked DynamoDB putItem function
const mockPutItem = jest.fn((params, callback) => {
  if (params.Item.text === 'success') {
    callback(null, 'Success');
  } else {
    callback('Failure');
  }
});

// Mock the SQS and DynamoDB clients
jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    sendMessage: mockSendMessage,
  })),
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: mockPutItem,
    })),
  },
}));

describe('createTodo', () => {
  it('should create a new todo successfully', async () => {
    const event = {
      body: JSON.stringify({
        text: 'success',
      }),
    };

    const result = await createTodo.main(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify('Success'));
    expect(mockSendMessage).toBeCalledTimes(1);
    expect(mockPutItem).toBeCalledTimes(1);
  });

  it('should handle failure when creating todo', async () => {
    const event = {
      body: JSON.stringify({
        text: 'failure',
      }),
    };

    const result = await createTodo.main(event);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(JSON.stringify('Failure'));
    expect(mockSendMessage).toBeCalledTimes(1);
    expect(mockPutItem).toBeCalledTimes(1);
  });
});