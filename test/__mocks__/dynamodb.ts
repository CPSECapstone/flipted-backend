export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const putFn = jest.fn().mockImplementation(() => {
   promise: awsSdkPromiseResponse;
});

const getFn = jest.fn().mockImplementation(() => {
   promise: awsSdkPromiseResponse;
});

const dynamodbMock = {
   put: putFn,
   get: getFn,
   putComposite: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   })
};

export default dynamodbMock;
