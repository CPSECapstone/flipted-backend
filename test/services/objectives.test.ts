import dynamodbMock from "../__mocks__/dynamodb";
import dynamodb from "../../src/services/dynamodb";
import { mocked } from "ts-jest/utils";
import * as services from "../../src/services/objective";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("add method", () => {
   test("add learning objective", async () => {
      const objective: ObjectiveInput = {
         name: "obj 1",
         description: "obj 1 description",
         targetId: "target id 1",
         targetName: "target name 1",
         course: "Biology"
      };

      const MockedDynamoDB = mocked(dynamodb, true);

      await services.addObjective(objective);
      expect(MockedDynamoDB.putComposite).toHaveBeenCalledTimes(1);
   });
});
