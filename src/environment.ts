//EXAMPLE ENVIRONMENT VARIABLE OBJECT UTILIZING .env FILES
type Environment = {
  stage: string;
  taskToQuestionsTable: string
  taskSubmissionsTable: string
};

export const environment: Environment = {
  stage: process.env.STAGE as string,
  taskToQuestionsTable: process.env.TASK_TO_QUESTIONS_TABLE as string,
  taskSubmissionsTable: process.env.TASK_SUBMISSIONS_TABLE as string
};
