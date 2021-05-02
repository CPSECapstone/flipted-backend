import dynamodbMock from "../__mocks__/dynamodb";
import * as service from "../../src/services/learningTarget";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("addLearningTarget method", () => {
   test("add learning target", async () => {
      const target: LearningTargetInput = {
         name: "TE 1",
         description: "Learning Target 1 Description",
         subject: "Science",
         gradeLevel: 6,
         icon: "",
         standards: "",
         course: "Integrated Science"
      };

      await service.addLearningTarget(target);
      expect(dynamodbMock.putComposite).toHaveBeenCalledTimes(1);
   });
});
