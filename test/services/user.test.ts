import dynamodb from "../../src/services/dynamodb";
import { mocked } from "ts-jest/utils";
import userService from "../../src/services/user";
import { marshall } from "@aws-sdk/util-dynamodb";

const TEST_USER_ID = "1234";
const TEST_USER_FNAME = "John";
const TEST_USER_LNAME = "Smith";

jest.mock("../../src/services/dynamodb", () => {
   const getFn = jest.fn().mockImplementation(() => {
      return Promise.resolve({
         Item: marshall({
            id: TEST_USER_ID,
            firstName: TEST_USER_FNAME,
            lastName: TEST_USER_LNAME
         })
      });
   });

   const updateFn = jest.fn().mockImplementation(() => {
      return Promise.resolve({
         Attributes: marshall({
            firstName: TEST_USER_FNAME,
            lastName: TEST_USER_LNAME
         })
      });
   });

   const userDynamodbMock = {
      get: getFn,
      update: updateFn
   };

   return userDynamodbMock;
});

describe("get method", () => {
   test("get user", async () => {
      const MockedDynamoDB = mocked(dynamodb, true);
      const expected = <User>{
         id: TEST_USER_ID,
         firstName: TEST_USER_FNAME,
         lastName: TEST_USER_LNAME
      };
      const actual = await userService.get(TEST_USER_ID);
      expect(MockedDynamoDB.get).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
   });
});

describe("update method", () => {
   test("update user", async () => {
      const MockedDynamoDB = mocked(dynamodb, true);
      const expected = {
         firstName: TEST_USER_FNAME,
         lastName: TEST_USER_LNAME
      };
      const actual = await userService.update(TEST_USER_ID, {
         firstName: "John",
         lastName: "Smith"
      });
      expect(MockedDynamoDB.update).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(expected);
   });
});
