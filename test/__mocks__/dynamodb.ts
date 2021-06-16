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
   }),
   deleteItem: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   }),
   queryList: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   }),
   update: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   }),
   updateMarshall: jest.fn().mockImplementation(() => {
      promise: awsSdkPromiseResponse;
   })
};

export default dynamodbMock;
