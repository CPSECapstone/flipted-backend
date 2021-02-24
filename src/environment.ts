//EXAMPLE ENVIRONMENT VARIABLE OBJECT UTILIZING .env FILES
type Environment = {
   secretMessage: string;
 };
 
 export const environment: Environment = {
   secretMessage: process.env.SECRET_MESSAGE as string,
 };