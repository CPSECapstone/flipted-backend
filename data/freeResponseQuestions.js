const data = require("./freeResponseQuestions.json");

function generatePayload(question) {
   let query = `
    mutation {
      addFRQuestion(
        question: {
          description: "${question.description}"
          points: ${question.points}
          answer: "${question.answer}"
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

module.exports = data.questions.map(generatePayload);
