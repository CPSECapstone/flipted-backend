async function submitMultChoiceBlock(_: any, args: any, context: any) {
   
}

async function submitFreeResponseBlock(_: any, args: any, context: any) {

}

const resolvers = {
  Query: {
    
  },
  Mutation: {
   submitMultChoiceBlock : submitMultChoiceBlock,
   submitFreeResponseBlock: submitFreeResponseBlock
  }
};

export default resolvers;
