const data = require('./tasks.json');

function generatePayload(task) {
  let query = `
  mutation addTask {
   addTask(
     task: {
       name: "AwesomeTask"
       instructions: "Follow these instructions"
       points: 3
       subMissionId: "0"
       objectiveId: "0"
       pages: [
         {
           canAdvanceBeforeRubricRequirementsComplete: false
           blocks: [
             {
               title: "My First Block"
               requirement: {
                 description: "Read this first block"
                 isComplete: false
               }
               type: TEXT
               textBlockInput: {
                 contents: "This is the contents of this first block"
                 fontSize: 12
               }
             }
             {
               title: "Here is an image"
               requirement: {
                 description: "Look at this image"
                 isComplete: false
               }
               type: IMAGE
               imageBlockInput: { imageUrl: "https://i.imgur.com/tmawqgH.jpg" }
             }
           ]
         }
         {
           canAdvanceBeforeRubricRequirementsComplete: false
           blocks: [
             {
               title: "Welcome to the second page"
               requirement: {
                 description: "Read this block"
                 isComplete: false
               }
               type: TEXT
               textBlockInput: {
                 contents: "This is the contents of this second page first block"
                 fontSize: 12
               }
             }
           ]
         }
       ]
     }
   )
 }
  `;

  const payload = {
    operationName: null,
    query,
    variables: {}
  };

  return payload;
}

module.exports = data.tasks.map(generatePayload);




