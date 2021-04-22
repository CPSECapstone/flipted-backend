import { FreeResponseAnswerInput, FreeResponseAnswerItem, MultipleChoiceAnswerInput, MultipleChoiceAnswerItem, TaskProgressInput, TaskProgressItem } from "../../src/interfaces/taskSubmission";
import { freeResponseAnswerInputToDBItem, multipleChoiceAnswerInputToDBItem, taskProgressInputToDBItem } from "../../src/services/taskSubmissionHelper";

describe("converting a TaskProgressInput to a TaskProgressItem", () => {
   it("will do so as expected without errors", async () => {
      
      const input: TaskProgressInput = {
         taskId: "TASK_ID#12345",
         finishedRequirementIds: ["XYZ", "123"]
      }

      const username = "fliptedEdRoXX"

      const expectedOutput: TaskProgressItem = {
         PK: "TASK_PROGRESS#" + username,
         SK: "TASK_ID#12345",
         username: "fliptedEdRoXX",
         finishedRequirementIds: ["XYZ", "123"]
      }

      expect(taskProgressInputToDBItem(input, username)).toEqual(expectedOutput);
   });
});

describe("converting a QuestionAnswerInput to a QuestionAnswerItem", () => {
   it("will convert a MultipleChoiceAnswerInput as expected without errors", async () => {
      
      const input: MultipleChoiceAnswerInput = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answerIndex: 2
      }

      const username = "fliptedEdRoXX"

      const expectedOutput: MultipleChoiceAnswerItem = {
         PK: "USER#" + username,
         SK: "ABC",
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         answerIndex: 2
      }

      expect(multipleChoiceAnswerInputToDBItem(input, username)).toEqual(expectedOutput);
   });

   it("will convert a FreeResponseAnswerInput as expected without errors", async () => {
      
      const input: FreeResponseAnswerInput = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answer: "Hello, world!"
      }

      const username = "fliptedEdRoXX"

      const expectedOutput: FreeResponseAnswerItem = {
         PK: "USER#" + username,
         SK: "ABC",
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         answer: "Hello, world!"
      }

      expect(freeResponseAnswerInputToDBItem(input, username)).toEqual(expectedOutput);
   });
});
