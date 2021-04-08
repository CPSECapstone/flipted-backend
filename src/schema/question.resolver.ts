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

async function addQuestionsToTask(_: any, args: any, context: any) {
  const questionIds: string[] = args.questionIds;
  const taskId: string = args.taskId;
  return questionService.addQuestionsToTask(questionIds, taskId);
}

async function listQuestionsByTaskId(_: any, args: any, context: any) {
  const taskId: string = args.taskId;
  return questionService.listQuestionsByTaskId(taskId);
}

const resolvers = {
  Query: {
    question: getQuestionById,
    questions: listQuestionsByTaskId
  },
  Mutation: {
    addQuestion,
    addQuestionsToTask
  }
};

export default resolvers;
