import { MCQuestion } from "../../src/interfaces/question";
import { QuizBlock } from "../../src/interfaces/taskblock";
import { quizBlockContainsQuestionId } from "../../src/services/questionHelper";

describe("Validating a question answer submission", () => {
   it("will make sure the question is contained in the provided quizblock", async () => {
      const question: MCQuestion = {
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
      }

      expect(quizBlockContainsQuestionId(quizBlock, question.id)).toBeTruthy();
      expect(quizBlockContainsQuestionId(quizBlock, "NON_EXISTENT_ID")).toBeFalsy();
   });
});
