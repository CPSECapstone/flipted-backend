import { FRQuestion, MCQuestion, Question } from "../../src/interfaces/question";
import {
   Answer,
   FreeResponseAnswer,
   FreeResponseAnswerInput,
   FreeResponseAnswerItem,
   MultipleChoiceAnswer,
   MultipleChoiceAnswerInput,
   MultipleChoiceAnswerItem,
   QuestionAndAnswer,
   TaskProgress,
   TaskProgressInput,
   TaskProgressItem,
   TaskSubmissionResult
} from "../../src/interfaces/taskSubmission";
import {
   createTaskSubmissionResult,
   dbItemToFreeResponseAnswer,
   dbItemToMultipleChoiceAnswer,
   dbItemToTaskProgress,
   freeResponseAnswerInputToDBItem,
   multipleChoiceAnswerInputToDBItem,
   taskProgressInputToDBItem
} from "../../src/services/taskSubmissionHelper";

describe("converting a TaskProgressInput to a TaskProgressItem", () => {
   it("will do so as expected without errors", async () => {
      const input: TaskProgressInput = {
         taskId: "TASK_ID#12345",
         finishedRequirementIds: ["XYZ", "123"]
      };

      const username = "fliptedEdRoXX";

      const expectedOutput: TaskProgressItem = {
         PK: "TASK_PROGRESS#" + username,
         SK: "TASK_ID#12345",
         username: "fliptedEdRoXX",
         finishedRequirementIds: ["XYZ", "123"]
      };

      expect(taskProgressInputToDBItem(input, username)).toEqual(expectedOutput);
   });
});

describe("converting a TaskProgressItem to a TaskProgress", () => {
   it("will do so as expected without errors", async () => {
      const input: TaskProgressItem = {
         finishedRequirementIds: ["5110abd8c4f"],
         PK: "TASK_PROGRESS#Google_114560337406279161954",
         SK: "c5110abd8c4",
         username: "Google_114560337406279161954"
      };

      const expectedOutput: TaskProgress = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         finishedRequirementIds: ["5110abd8c4f"]
      };

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
         questionBlockId: "123",
         pointsAwarded: 3
      };

      const expectedOutput: MultipleChoiceAnswer = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         questionId: "MC_QUESTION#a9bfcb78e7d",
         answerId: 2,
         questionBlockId: "123",
         pointsAwarded: 3
      };

      expect(dbItemToMultipleChoiceAnswer(input)).toEqual(expectedOutput);
   });

   it("will do so as expected for free response without errors", async () => {
      const input: FreeResponseAnswerItem = {
         answer: "Hello World!",
         PK: "USER#Google_114560337406279161954",
         SK: "MC_QUESTION#a9bfcb78e7d",
         taskId: "c5110abd8c4",
         questionBlockId: "123",
         pointsAwarded: 0
      };

      const expectedOutput: FreeResponseAnswer = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         questionId: "MC_QUESTION#a9bfcb78e7d",
         answer: "Hello World!",
         questionBlockId: "123",
         pointsAwarded: 0
      };

      expect(dbItemToFreeResponseAnswer(input)).toEqual(expectedOutput);
   });
});

describe("converting a QuestionAnswerInput to a QuestionAnswerItem", () => {
   it("will convert a MultipleChoiceAnswerInput as expected without errors", async () => {
      const input: MultipleChoiceAnswerInput = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answerId: 2
      };

      const username = "fliptedEdRoXX";

      const expectedOutput: MultipleChoiceAnswerItem = {
         PK: "USER#" + username,
         SK: "ABC",
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         answerIndex: 2,
         pointsAwarded: 3
      };

      expect(multipleChoiceAnswerInputToDBItem(input, username, 3)).toEqual(expectedOutput);
   });

   it("will convert a FreeResponseAnswerInput as expected without errors", async () => {
      const input: FreeResponseAnswerInput = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answer: "Hello, world!"
      };

      const username = "fliptedEdRoXX";

      const expectedOutput: FreeResponseAnswerItem = {
         PK: "USER#" + username,
         SK: "ABC",
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         answer: "Hello, world!",
         pointsAwarded: 0
      };

      expect(freeResponseAnswerInputToDBItem(input, username)).toEqual(expectedOutput);
   });
});

describe("Creating a task submission result", () => {
   it("will use information on the task, questions, and question answers to make a task submission", async () => {
      
      // inputs
      const mcAnswer: MultipleChoiceAnswer = {
         username: "user",
         questionId: "MC_QUESTION#456",
         taskId: "abc",
         questionBlockId: "xyz",
         pointsAwarded: 2,
         answerId: 3
      };

      const frAnswer: FreeResponseAnswer = {
         username: "user",
         questionId: "FR_QUESTION#123",
         taskId: "abc",
         questionBlockId: "xyz",
         pointsAwarded: 3,
         answer: "I like BUBBLES!"
      };

      const frQ: FRQuestion = {
         id: "FR_QUESTION#123",
         description: "",
         points: 4,
         answer: "hello!"
      };

      const mcQ: MCQuestion = {
         id: "MC_QUESTION#456",
         description: "",
         points: 2,
         answers: [],
         options: []
      };
      const questions: Question[] = [frQ, mcQ];

      const answers: Answer[] = [mcAnswer, frAnswer];

      // expected output
      const expectedQuestionAndAnswers: QuestionAndAnswer[] = [
         {
            question: JSON.parse(JSON.stringify(mcQ)),
            answer: { pointsAwarded: 2, answer: "3" }
         },
         {
            question: JSON.parse(JSON.stringify(frQ)),
            answer: {pointsAwarded: 3, answer: "I like BUBBLES!"}
         }
      ];
      const expectedOutput: TaskSubmissionResult = {
         graded: false,
         taskId: "TASK#123",
         pointsAwarded: 5,
         pointsPossible: 6,
         questionAndAnswers: expectedQuestionAndAnswers
      };
      expect(createTaskSubmissionResult(6, "TASK#123", answers, questions)).toEqual(expectedOutput)
   });
});
