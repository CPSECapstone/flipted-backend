async function gradeTaskSubmission(_: any, args: any, context: FliptedContext, info: any) {
  
}

async function gradeAnswer(_: any, args: any, context: any, info: any) {
  
}

const resolvers = {
   Mutation: {
      gradeTaskSubmission: gradeTaskSubmission,
      gradeAnswer: gradeAnswer
   }
};

export default resolvers;
