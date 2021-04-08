import { unmarshall } from "@aws-sdk/util-dynamodb";

import { environment } from "../environment";
import { MultipleChoiceQuestionInput, MultipleChoiceQuestion } from "../interfaces";
import dynamodb, { BatchGetParams, BatchWriteParams, GetParams, PutParams, ScanParams } from "./dynamodb";

const QUESTIONS_TABLE = "Questions-" + environment.stage;
const TASK_TO_QUESTIONS_TABLE = environment.taskToQuestionsTable;

async function add(question: MultipleChoiceQuestionInput) {
  const options = question.options.map((option: string, index: number) => {
    return {
      id: index,
      description: option
    };
  });

  const params: PutParams = {
    tableName: QUESTIONS_TABLE,
    item: {
      description: question.description,
      answers: question.answers,
      options,
      points: question.points
    }
  }

  return dynamodb.put(params);
}

async function getById(questionId: string): Promise<MultipleChoiceQuestion> {
  const params: GetParams = {
    tableName: QUESTIONS_TABLE,
    key: questionId,
    projectionExpression: "id, description, options, points"//answer
  };

  try {
    const output = await dynamodb.get(params);
    if (output.Item) {
      return <MultipleChoiceQuestion>unmarshall(output.Item);
    }
    throw new Error(`Quiz not found with id=${questionId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listByIds(questionIds: string[], withAnswer: boolean = false)
  : Promise<MultipleChoiceQuestion[]> {
  let projection = withAnswer ? "id, description, options, points"
    : "id, description, options, points, answer";
  const params: BatchGetParams = {
    tableName: QUESTIONS_TABLE,
    keyName: "id",
    keyValues: questionIds,
    projectionExpression: projection //answers
  };

  try {
    const output = await dynamodb.batchGet(params);
    if (output.Responses) {
      const questions = output.Responses[QUESTIONS_TABLE];
      return questions.map((item: any) => {
        return <MultipleChoiceQuestion>unmarshall(item);
      });
    }

    return [];
  } catch (err) {
    return err;
  }
}

async function addQuestionsToTask(questionIds: string[], taskId: string): Promise<number> {
  const params: BatchWriteParams = {
    tableName: TASK_TO_QUESTIONS_TABLE,
    items: questionIds.map((questionId: string) => {
      return {
        questionId,
        taskId
      };
    })
  };

  try {
    const output = await dynamodb.batchWrite(params);
    if (output.ConsumedCapacity && output.ConsumedCapacity[0].CapacityUnits) {
      return output.ConsumedCapacity[0].CapacityUnits;
    }

    return 0;
  } catch (err) {
    return err;
  }
}

async function listQuestionsByTaskId(taskId: string): Promise<MultipleChoiceQuestion[]> {
  const params: ScanParams = {
    tableName: TASK_TO_QUESTIONS_TABLE,
    filterExpression: 'taskId = :taskId',
    expressionAttributeValues: {
      ":taskId": taskId
    }
  };

  try {
    const output = await dynamodb.scan(params);
    if (output.Items) {
      const questionIds: string[] = output.Items.map((item: any) => {
        const unmarshalled = unmarshall(item)
        return unmarshalled["questionId"];
      });
      const questions = await questionService.listByIds(questionIds);
      return questions;
    }

    return [];
  } catch (err) {
    return err;
  }
}

const questionService = {
  add,
  getById,
  listByIds,
  addQuestionsToTask,
  listQuestionsByTaskId
}

export default questionService;
