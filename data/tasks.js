const superagent = require('superagent');
const data = require('./tasks.json');

const END_POINT = 'http://localhost:3000/dev/graphql';

function generatePayload(task) {
  let query = `
    mutation {
      addTask(
        task: {
          name: "${task.name}",
          instructions: "${task.instructions}",
          subMissionId: "${task.subMissionId}"
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
  const tasks = data.tasks;

  tasks.forEach((task) => {
    const payload = generatePayload(task);

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



