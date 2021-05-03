const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const sendRequest = require("./index");

function generateObjectivePayload(objective) {
   let query = `
    mutation {
      addObjective(
        objective: {
          course: "${objective.Course}"
          targetId: "${objective.TargetId}"
          targetName: "${objective.TargetName}"
          objectiveName: "${objective.ObjectiveName}"
          description: "${objective.Description}"
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

fs.createReadStream("data/objectives.csv")
   .pipe(csv({ quote: '"' }))
   .on("data", data => results.push(data))
   .on("end", () => {
      results.map(objective => {
         const payload = generateObjectivePayload(objective);
         console.dir(objective);
         console.dir(payload);
         sendRequest(payload);
      });
   });
