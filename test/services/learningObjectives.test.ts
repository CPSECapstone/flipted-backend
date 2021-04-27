import dynamodbMock from "../__mocks__/dynamodb";
import dynamodb from "../../src/services/dynamodb";
import { mocked } from "ts-jest/utils";

import learningObjectiveService from "../../src/services/learningObjective";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("add method", () => {
   test("add learning objective", async () => {
      const objective: LearningObjectiveInput = {
         name: "obj 1",
         course: "Biology",
         description: "obj 1 description"
      };

      const MockedDynamoDB = mocked(dynamodb, true);

      await learningObjectiveService.add(objective);
      expect(MockedDynamoDB.put).toHaveBeenCalledTimes(1);
   });
});
