const superagent = require('superagent');
const learningObjectives = require('./learningObjectives.json');

const END_POINT = 'http://localhost:3000/dev/graphql';

function generateLearningObjectivePayload(course, name) {
  let query = `
    mutation {
      addLearningObjective(
        objective: {
          course: "${course}",
          name: "${name}",
          description: "${name}"
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

function sendRequest() {
  const objectives = learningObjectives.learningObjectives;

  objectives.forEach((objective) => {
    const course = learningObjectives.course;
    const name = objective;
    const payload = generateLearningObjectivePayload(course, name);

    superagent
      .post(END_POINT).send(payload)
      .set('accept', 'json')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.dir(res.body.data, { depth: null, colors: true });
        }
      });
  });
}

sendRequest();



