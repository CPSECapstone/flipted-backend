const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const sendRequest = require("./index");

function generatePayload(target) {
   let query = `
    mutation {
      addTarget(target: {
         targetName: "${target.TargetName}"
         description: "${target.Description}"
         subject: "${target.Subject}"
         gradeLevel: ${target.GradeLevel}
         icon: "${target.Icon}"
         standards: "${target.Standards}"
         course: "${target.Course}"
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

fs.createReadStream("data/targets.csv")
   .pipe(csv({ quote: '"' }))
   .on("data", data => results.push(data))
   .on("end", () => {
      results.map(course => {
         const payload = generatePayload(course);
         console.dir(course);
         console.dir(payload);
         sendRequest(payload);
      });
   });
