import { string } from "yargs";
import { RoleInternal } from "./interfaces/role";

//EXAMPLE ENVIRONMENT VARIABLE OBJECT UTILIZING .env FILES
type Environment = {
   databaseStage: string;
   providerStage: string;
};

export const environment: Environment = {
   providerStage: (process.env.PROVIDER_STAGE as string) || "dev",
   databaseStage: (process.env.DATABASE_STAGE as string) || "dev"
};

// NOW all deployments use the same same database.
// If in future, we need to separate the database into prod version and dev version
// update this method
export function TABLE_NAME(name: string): string {
   return `flipted-${environment.databaseStage}-${name}`;
}

export function TO_DB_DATE(date: Date) : string {
   return date.toISOString()
}

export function TO_GRAPHQL_DATE(date: any) : Date {
   return new Date(date)
}

export function FROM_DB_DATE(dateString: string) : Date {
   return new Date(dateString)
}

export const USERS_TABLE_NAME = TABLE_NAME("Users");
export const COURSE_CONTENT_TABLE_NAME = TABLE_NAME("CourseContent");
export const USER_PROGRESS_TABLE_NAME = TABLE_NAME("UserProgress");
export const GOALS_TABLE_NAME = TABLE_NAME("Goals");
export const QUESTIONS_TABLE = TABLE_NAME("Questions");
export const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");
export const MASTERY_TABLE = TABLE_NAME("Mastery");
export const MARKETPLACE_TABLE = TABLE_NAME("Marketplace")
export const notInstructorErrorMessage = "User is not an authorized instructor."
