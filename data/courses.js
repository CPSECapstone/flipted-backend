const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const sendRequest = require("./index");

function generatePayload(course) {
   let query = `
    mutation {
      addCourse(course: {
          name: "${course.name}",
          description: "${course.description}",
          instructor: "${course.instructor}"
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

fs.createReadStream("data/courses.csv")
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
