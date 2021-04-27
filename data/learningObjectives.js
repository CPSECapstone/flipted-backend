const data = require("./learningObjectives.json");

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

const objectives = data.learningObjectives;

const payloads = objectives.map(objective => {
   const course = data.course;
   const name = objective;
   return generateLearningObjectivePayload(course, name);
});

module.exports = payloads;
