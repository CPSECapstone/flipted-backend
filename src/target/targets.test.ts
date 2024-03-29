import dynamodbMock from "../../test/__mocks__/dynamodb";
import * as service from "./targetService";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("addTarget method", () => {
   test("add target", async () => {
      const target: TargetInput = {
         targetName: "TE 1",
         description: "Learning Target 1 Description",
         subject: "Science",
         gradeLevel: 6,
         icon: "",
         standards: "",
         course: "Integrated Science"
      };

      await service.addTarget(target);
      expect(dynamodbMock.putComposite).toHaveBeenCalledTimes(1);
   });
});
