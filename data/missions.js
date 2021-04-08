const data = require('./missions.json');

function generatePayload(mission) {
  let query = `
    mutation {
      addMission(
        mission: {
          course: "${mission.course}",
          name: "${mission.name}"
          description: "${mission.description}"
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

module.exports = data.missions.map(generatePayload);




