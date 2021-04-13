//EXAMPLE ENVIRONMENT VARIABLE OBJECT UTILIZING .env FILES
type Environment = {
  stage: string
};

export const environment: Environment = {
  stage: process.env.STAGE as string
};

export function TABLE_NAME(name: string): string {
  return `flipted-${name}-${environment.stage}`;
}

export const USERS_TABLE_NAME: string = 'flipted-dev-Users';