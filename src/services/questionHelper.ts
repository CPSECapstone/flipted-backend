import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { FrQuestionItem, McQuestionItem, QuestionItem } from "../interfaces/question";

export function gradeMultipleChoiceQuestion(question: McQuestion, answerIndex: number): number {
   return question.answers.includes(answerIndex) ? question.points : 0;
}

// convert input from request to a item object that will be inserted into db
export function frQuestionInputToDBItem(question: FrQuestionInput): QuestionItem {
   const questionId = uid();

   const questionItem: FrQuestionItem = {
      id: `FR_QUESTION#${questionId}`,
      description: question.description,
      points: question.points,
      answer: question.answer
   };

   return questionItem;
}

// convert input from request to a item object that will be inserted into db
export function mcQuestionInputToDBItem(question: McQuestionInput): QuestionItem {
   const options = question.options.map((option: string, index: number) => {
      return {
         id: index,
         description: option
      };
   });

   const questionId = uid();

   const questionItem: McQuestionItem = {
      id: `MC_QUESTION#${questionId}`,
      description: question.description,
      points: question.points,
      options,
      answers: question.answers
   };

   return questionItem;
}

// convert row database item result to Question array
export function dbResponsesToQuestions(items: any[], withAnswer: boolean): Question[] {
   const questions: Question[] = items.map((item: any) => {
      const questionItem = unmarshall(item);
      const splits = questionItem.id.split("#");
      const type = splits[0];
      if (type === "MC_QUESTION") {
         return <McQuestion>{
            id: questionItem.id,
            description: questionItem.description,
            points: questionItem.points,
            options: questionItem.options,
            answers: withAnswer ? questionItem.answers : []
         };
      } else if (type === "FR_QUESTION") {
         return <FrQuestion>{
            id: questionItem.id,
            description: questionItem.description,
            points: questionItem.points,
            answer: withAnswer ? questionItem.answer : ""
         };
      } else {
         throw new Error("Unknown Question Type");
      }
   });

   return questions;
}

export function quizBlockContainsQuestionIdWithPrefix(
   quizBlock: QuizBlock,
   id: String,
   prefix: String
): boolean {
   return quizBlock.questions.filter(q => q.id == id && id.split("#")[0] == prefix).length === 1;
}

export function isValidMultipleChoiceAnswer(mcQuestion: McQuestion, answerId: number) {
   return mcQuestion.options.filter(choice => choice.id === answerId).length === 1;
}
