import * as questionService from "../src/services/question";
import data from "./frQuestions.json";

function importFrQuestions() {
   console.log(data);
   const frQuestions = data.questions.map((question: any) => {
      return <FrQuestionInput>{
         description: question.description,
         points: parseInt(question.points),
         answer: question.answer
      };
   });

   questionService
      .batchWriteFrQuestions(frQuestions)
      .then(output => {
         console.dir(output);
      })
      .catch(err => {
         console.log(err);
      });
}

importFrQuestions();
