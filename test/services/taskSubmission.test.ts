import { FreeResponseAnswer, FreeResponseAnswerInput, FreeResponseAnswerItem, MultipleChoiceAnswer, MultipleChoiceAnswerInput, MultipleChoiceAnswerItem, TaskProgress, TaskProgressInput, TaskProgressItem } from "../../src/interfaces/taskSubmission";
import { dbItemToFreeResponseAnswer, dbItemToMultipleChoiceAnswer, dbItemToTaskProgress, freeResponseAnswerInputToDBItem, multipleChoiceAnswerInputToDBItem, taskProgressInputToDBItem } from "../../src/services/taskSubmissionHelper";

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

describe("converting a TaskProgressItem to a TaskProgress", () => {
   it("will do so as expected without errors", async () => {
      
      const input: TaskProgressItem = {
         finishedRequirementIds: [
           "5110abd8c4f"
         ],
         PK: "TASK_PROGRESS#Google_114560337406279161954",
         SK: "c5110abd8c4",
         username: "Google_114560337406279161954"
       }

      const expectedOutput: TaskProgress = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         finishedRequirementIds: ["5110abd8c4f"]
      }

      expect(dbItemToTaskProgress(input)).toEqual(expectedOutput);
   });
});

describe("converting QuestionAnswerItem to a QuestionAnswer", () => {
   it("will do so as expected for multiple choice without errors", async () => {
      
      const input: MultipleChoiceAnswerItem = {
         answerIndex: 2,
         PK: "USER#Google_114560337406279161954",
         SK: "MC_QUESTION#a9bfcb78e7d",
         taskId: "c5110abd8c4",
         questionBlockId: "123"
       }

      const expectedOutput: MultipleChoiceAnswer = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         answerId: "MC_QUESTION#a9bfcb78e7d",
         answerIndex: 2,
         questionBlockId: "123"
      }

      expect(dbItemToMultipleChoiceAnswer(input)).toEqual(expectedOutput);
   });

   it("will do so as expected for free response without errors", async () => {
      
      const input: FreeResponseAnswerItem = {
         answer: "Hello World!",
         PK: "USER#Google_114560337406279161954",
         SK: "MC_QUESTION#a9bfcb78e7d",
         taskId: "c5110abd8c4",
         questionBlockId: "123"
       }

      const expectedOutput: FreeResponseAnswer = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         answerId: "MC_QUESTION#a9bfcb78e7d",
         answer: "Hello World!",
         questionBlockId: "123"
      }

      expect(dbItemToFreeResponseAnswer(input)).toEqual(expectedOutput);
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
