import dynamodbMock from "../../test/__mocks__/dynamodb";
import * as services from "./objectiveService";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("add method", () => {
   test("add learning objective", async () => {
      const objective: ObjectiveInput = {
         objectiveName: "obj 1",
         description: "obj 1 description",
         targetId: "target id 1",
         targetName: "target name 1",
         course: "Biology",
         taskIds: []
      };

      await services.addObjective(objective);
      expect(dynamodbMock.batchWrite).toHaveBeenCalledTimes(1);
   });
});
