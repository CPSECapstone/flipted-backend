export const awsSkdPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const putFn = jest.fn().mockImplementation(() => {
   promise: awsSkdPromiseResponse;
});

const getFn = jest.fn().mockImplementation(() => {
   promise: awsSkdPromiseResponse;
});

const dynamodbMock = {
   put: putFn,
   get: getFn
};

export default dynamodbMock;
