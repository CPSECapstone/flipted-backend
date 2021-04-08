const data = require('./multipleChoiceQuestions.json');

function generatePayload(question) {
  let query = `
    mutation {
      addQuestion(
        question: {
          description: "${question.description}"
          points: "${question.points}"
          options: "${question.options}"
          answers: "${question.answers}"
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

