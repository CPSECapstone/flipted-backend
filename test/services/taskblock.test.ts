import {
   isValidMultipleChoiceAnswer,
   quizBlockContainsQuestionIdWithPrefix
} from "../../src/services/questionHelper";

describe("Validating a question answer submission", () => {
   it("will make sure the question is contained in the provided quizblock as the expected type", async () => {
      const question: McQuestion = {
         id: "MC_QUESTION#123",
         description: "",
         points: 1,
         options: [],
         answers: [1]
      };

      const quizBlock: QuizBlock = {
         blockId: "QUIZBLOCK#123",
         title: "My test quiz",
         pageIndex: 0,
         blockIndex: 0,
         points: 1,
         requiredScore: 1,
         questions: [question]
      };

      expect(
         quizBlockContainsQuestionIdWithPrefix(quizBlock, question.id, "MC_QUESTION")
      ).toBeTruthy();

      // exists, but wrong type
      expect(
         quizBlockContainsQuestionIdWithPrefix(quizBlock, question.id, "FR_QUESTION")
      ).toBeFalsy();

      // doesn't exist at all
      expect(
         quizBlockContainsQuestionIdWithPrefix(quizBlock, "NON_EXISTENT_ID", "MC_QUESTION")
      ).toBeFalsy();
   });

   it("will make sure the provided answer is an option for a multiple choice question", async () => {
      const question: McQuestion = {
         id: "MC_QUESTION#123",
         description: "",
         points: 1,
         options: [
            { id: 0, description: "O1" },
            { id: 1, description: "O2" }
         ],
         answers: [1]
      };

      const quizBlock: QuizBlock = {
         blockId: "QUIZBLOCK#123",
         title: "My test quiz",
         pageIndex: 0,
         blockIndex: 0,
         points: 1,
         requiredScore: 1,
         questions: [question]
      };

      expect(isValidMultipleChoiceAnswer(question, 0)).toBeTruthy();
      expect(isValidMultipleChoiceAnswer(question, 1)).toBeTruthy(); // not correct, but is valid answer

      expect(isValidMultipleChoiceAnswer(question, 2)).toBeFalsy(); // id 2 is not an option
   });
});
