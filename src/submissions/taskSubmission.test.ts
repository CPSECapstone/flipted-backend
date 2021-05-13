import {
   Answer,
   AnswerOut,
   FreeResponseAnswer,
   FreeResponseAnswerItem,
   MultipleChoiceAnswer,
   MultipleChoiceAnswerItem,
   QuestionProgress,
   TaskProgressItem,
   TaskSubmissionResultItem
} from "./taskSubmissionInterface";
import {
   answerToAnswerOut,
   createQuestionProgressOutput,
   createTaskSubmissionResult,
   dbItemToFreeResponseAnswer,
   dbItemToMultipleChoiceAnswer,
   dbItemToTaskProgress,
   dbItemToTaskSubmissionResult,
   freeResponseAnswerInputToDBItem,
   multipleChoiceAnswerInputToDBItem,
   taskProgressInputToDBItem,
   taskSubResultToDBItem
} from "./taskSubmissionHelper";

const mockMCAnswer: MultipleChoiceAnswer = {
   username: "user",
   questionId: "MC_QUESTION#456",
   taskId: "abc",
   questionBlockId: "xyz",
   pointsAwarded: 2,
   answerId: 3
};

const mockFRAnswer: FreeResponseAnswer = {
   username: "user",
   questionId: "FR_QUESTION#123",
   taskId: "abc",
   questionBlockId: "xyz",
   pointsAwarded: 3,
   answer: "I like BUBBLES!"
};

const mockFrQuestion: FrQuestion = {
   id: "FR_QUESTION#123",
   description: "",
   points: 4,
   answer: "hello!"
};

const mockMcQuestion: McQuestion = {
   id: "MC_QUESTION#456",
   description: "",
   points: 2,
   answers: [],
   options: []
};

const username = "BUBBLES!";

// expected output
const mockQuestionAndAnswers: QuestionAndAnswer[] = [
   {
      question: JSON.parse(JSON.stringify(mockMcQuestion)),
      answer: { pointsAwarded: 2, answer: "3", questionId: "MC_QUESTION#456" }
   },
   {
      question: JSON.parse(JSON.stringify(mockFrQuestion)),
      answer: { pointsAwarded: 3, answer: "I like BUBBLES!", questionId: "FR_QUESTION#123" }
   }
];

const mockTaskSubmissionResult: TaskSubmissionResult = {
   graded: false,
   pointsAwarded: 5,
   pointsPossible: 6,
   questionAndAnswers: mockQuestionAndAnswers,
   taskId: "TASK#123"
};

const mockTaskSubmissionResultItem: TaskSubmissionResultItem = {
   PK: "TASK_SUBMISSION#BUBBLES!",
   SK: "TASK#123",
   graded: false,
   pointsAwarded: 5,
   pointsPossible: 6,
   course: "TestCourse",
   missionId: "MISSION#123",
   questionAndAnswers: JSON.parse(JSON.stringify(mockQuestionAndAnswers))
};

describe("converting TaskSubmission types", () => {
   it("will convert from a TaskSubmissionResult to a TaskSubmissionResultItem", async () => {
      expect(taskSubResultToDBItem("TestCourse", "MISSION#123", mockTaskSubmissionResult, username)).toEqual(
         mockTaskSubmissionResultItem
      );
   });

   it("will convert from a TaskSubmissionResultItem to a TaskSubmissionResult", async () => {
      expect(dbItemToTaskSubmissionResult(mockTaskSubmissionResultItem)).toEqual(
         mockTaskSubmissionResult
      );
   });
});

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
         PK: "QUESTION_ANSWER#Google_114560337406279161954",
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
         PK: "QUESTION_ANSWER#Google_114560337406279161954",
         SK: "FR_QUESTION#a9bfcb78e7d",
         taskId: "c5110abd8c4",
         questionBlockId: "123",
         pointsAwarded: 0
      };

      const expectedOutput: FreeResponseAnswer = {
         username: "Google_114560337406279161954",
         taskId: "c5110abd8c4",
         questionId: "FR_QUESTION#a9bfcb78e7d",
         answer: "Hello World!",
         questionBlockId: "123",
         pointsAwarded: 0
      };

      expect(dbItemToFreeResponseAnswer(input)).toEqual(expectedOutput);
   });
});

describe("converting question Answer types", () => {
   it("will convert a MultipleChoiceAnswerInput to a db item as expected without errors", async () => {
      const input: MultipleChoiceAnswerInput = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answerId: 2
      };

      const username = "fliptedEdRoXX";

      const expectedOutput: MultipleChoiceAnswerItem = {
         PK: "QUESTION_ANSWER#" + username,
         SK: "ABC",
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         answerIndex: 2,
         pointsAwarded: 3
      };

      expect(multipleChoiceAnswerInputToDBItem(input, username, 3)).toEqual(expectedOutput);
   });

   it("will convert a FreeResponseAnswerInput to a db item as expected without errors", async () => {
      const input: FreeResponseAnswerInput = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answer: "Hello, world!"
      };

      const username = "fliptedEdRoXX";

      const expectedOutput: FreeResponseAnswerItem = {
         PK: "QUESTION_ANSWER#" + username,
         SK: "ABC",
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         answer: "Hello, world!",
         pointsAwarded: 0
      };

      expect(freeResponseAnswerInputToDBItem(input, username)).toEqual(expectedOutput);
   });

   it("will convert a MultipleChoiceAnswer to an AnswerOut as expected without errors", async () => {
      const input: MultipleChoiceAnswer = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answerId: 2,
         username: "fliptedEdRoXX",
         pointsAwarded: 10
      };

      const expectedOutput: AnswerOut = {
         questionId: "ABC",
         answer: "2",
         pointsAwarded: 10
      };

      expect(answerToAnswerOut(input)).toEqual(expectedOutput);
   });

   it("will convert a FreeResponseAnswer to an AnswerOut as expected without errors", async () => {
      const input: FreeResponseAnswer = {
         taskId: "TASK_ID#12345",
         questionBlockId: "123",
         questionId: "ABC",
         answer: "Bubbles!",
         username: "fliptedEdRoXX",
         pointsAwarded: 10
      };

      const expectedOutput: AnswerOut = {
         questionId: "ABC",
         answer: "Bubbles!",
         pointsAwarded: 10
      };

      expect(answerToAnswerOut(input)).toEqual(expectedOutput);
   });
});

describe("Creating a task submission result", () => {
   it("will use information on the task, questions, and question answers to make a task submission", async () => {
      const questions: Question[] = [mockFrQuestion, mockMcQuestion];
      const answers: Answer[] = [mockMCAnswer, mockFRAnswer];

      expect(createTaskSubmissionResult(6, "TASK#123", answers, questions)).toEqual(
         mockTaskSubmissionResult
      );
   });
});

describe("Creating a question progress object", () => {
   it("will create the output with no errors", async () => {
      const answers: Answer[] = [mockMCAnswer, mockFRAnswer];
      const taskId: string = "TASKID#123";

      const expectedOut: QuestionProgress = {
         taskId: "TASKID#123",
         answers: [
            { answer: "3", questionId: "MC_QUESTION#456" },
            { answer: "I like BUBBLES!", questionId: "FR_QUESTION#123" }
         ]
      };

      expect(createQuestionProgressOutput(taskId, answers)).toEqual(expectedOut);
   });
});
