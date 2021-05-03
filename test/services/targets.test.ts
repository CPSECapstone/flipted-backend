import dynamodbMock from "../__mocks__/dynamodb";
import * as service from "../../src/services/target";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("addTarget method", () => {
   test("add target", async () => {
      const target: TargetInput = {
         name: "TE 1",
         description: "Learning Target 1 Description",
         subject: "Science",
         gradeLevel: 6,
         icon: "",
         standards: "",
         courseName: "Integrated Science"
      };

      await service.addTarget(target);
      expect(dynamodbMock.putComposite).toHaveBeenCalledTimes(1);
   });
});
