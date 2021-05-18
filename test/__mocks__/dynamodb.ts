export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const dynamodbMock = {
   put: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   }),
   get: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   }),
   putComposite: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   }),
   batchWrite: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   })
};

export default dynamodbMock;
