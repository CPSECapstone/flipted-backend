import { MultipleChoiceQuestionInput } from "../interfaces";
import questionService from '../services/question';

async function addQuestion(_: any, args: any, context: any, info: any) {
  const question: MultipleChoiceQuestionInput = args.question;
  return questionService.add(question);
}

async function getQuestionById(_: any, args: any, context: any, info: any) {
  const questionId: string = args.questionId;
  return questionService.getById(questionId);
}

async function listQuestionsByQuestionIds(_: any, args: any, context: any) {
  const questionIds: string[] = args.questionIds;
  return questionService.listByIds(questionIds);
}

const resolvers = {
  Query: {
    question: getQuestionById,
    questions: listQuestionsByQuestionIds
  },
  Mutation: {
    addQuestion: addQuestion
  }
};

export default resolvers;
