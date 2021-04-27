import { MCQuestion } from "../../src/interfaces/question";
import { gradeMultipleChoiceQuestion } from "../../src/services/questionHelper";

describe("grading a multiple choice question", () => {
   it("will award full credit if the question is correct", async () => {
      const question: MCQuestion = {
         id: "0",
         description: "",
         points: 4,
         options: [],
         answers: [1]
      };

      const studentAnswer = 1;

      expect(gradeMultipleChoiceQuestion(question, studentAnswer)).toBeCloseTo(4);
   });

   it("will give no credit if incorrect", async () => {
      const question: MCQuestion = {
         id: "0",
         description: "",
         points: 4,
         options: [],
         answers: [1]
      };

      const studentAnswer = 2;

      expect(gradeMultipleChoiceQuestion(question, studentAnswer)).toBeCloseTo(0);
   });
});
