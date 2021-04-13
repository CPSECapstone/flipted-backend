const data = require('./multipleChoiceQuestions.json');

function generatePayload(question) {
  let options = question.options.map((option) => {
    return `"${option}"`;
  }).join(", ");

  let query = `
    mutation {
      addQuestion(
        question: {
          description: "${question.description}"
          points: ${question.points}
          options: [${options}]
          answers: [${question.answers}]
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

