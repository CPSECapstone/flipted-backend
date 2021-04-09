const data = require('./tasks.json');

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

module.exports = data.tasks.map(generatePayload);




