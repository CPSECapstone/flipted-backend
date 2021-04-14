//EXAMPLE ENVIRONMENT VARIABLE OBJECT UTILIZING .env FILES
type Environment = {
  stage: string
};

export const environment: Environment = {
  stage: process.env.STAGE as string || "dev"
};

export function TABLE_NAME(name: string): string {
  return `flipted-${environment.stage}-${name}`;
}
