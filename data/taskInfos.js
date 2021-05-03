const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const sendRequest = require("./index");

function generateTaskInfoPayload(target) {
   let query = `
    mutation {
      addTaskInfo(taskInfo: {
         taskName: "${target.TaskName}"
         course: "${target.Course}"
         targetId: "${target.TargetId}"
         objectiveId: "${target.ObjectiveId}"
         missionId: "${target.MissionId}"
         subMissionId: "${target.SubMissionId}"
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

fs.createReadStream("data/taskInfos.csv")
   .pipe(csv({ quote: '"' }))
   .on("data", data => results.push(data))
   .on("end", () => {
      results.map(taskInfo => {
         const payload = generateTaskInfoPayload(taskInfo);
         console.dir(taskInfo);
         console.dir(payload);
         sendRequest(payload);
      });
   });
