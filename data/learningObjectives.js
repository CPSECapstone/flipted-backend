const data = require("./objectives.json");

function generateObjectivePayload(course, name) {
   let query = `
    mutation {
      addObjective(
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

const objectives = data.objectives;

const payloads = objectives.map(objective => {
   const course = data.course;
   const name = objective;
   return generateObjectivePayload(course, name);
});

module.exports = payloads;
