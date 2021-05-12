//EXAMPLE ENVIRONMENT VARIABLE OBJECT UTILIZING .env FILES
type Environment = {
   dbStage: string;
};

export const environment: Environment = {
   dbStage: (process.env.DATABASE_STAGE as string) || "dev"
};

// NOW all deployments use the same same database.
// If in future, we need to separate the database into prod version and dev version
// update this method
export function TABLE_NAME(name: string): string {
   return `flipted-${environment.dbStage}-${name}`;
}

export const USERS_TABLE_NAME = TABLE_NAME("Users");
export const COURSE_CONTENT_TABLE_NAME = TABLE_NAME("CourseContent");
export const USER_PROGRESS_TABLE_NAME = TABLE_NAME("UserProgress");
export const GOALS_TABLE_NAME = TABLE_NAME("Goals");
export const QUESTIONS_TABLE = TABLE_NAME("Questions");
export const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");
