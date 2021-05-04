const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const sendRequest = require("./index");

function generateTaskPayload(task) {
   let missionId = task.MissionId ? task.MissionId : "";
   let missionIndex = task.MissionIndex ? task.MissionIndex : 0;
   let subMissionId = task.SubMissionId || "";
   let objectiveId = task.ObjectiveId || "";
   let targetId = task.TargetId || "";

   let query = `
    mutation {
      addTask(task: {
         name: "${task.TaskName}"
         instructions: "${task.Instructions}"
         points: ${task.Points}
         pages: []
         requirements: []
         course: "${task.Course}"
         missionId: "${missionId}"
         missionIndex: ${missionIndex}
         subMissionId: "${subMissionId}"
         objectiveId: "${objectiveId}"
         targetId: "${targetId}"
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

fs.createReadStream("data/tasks.csv")
   .pipe(csv({ quote: '"' }))
   .on("data", data => results.push(data))
   .on("end", () => {
      results.map(taskInfo => {
         const payload = generateTaskPayload(taskInfo);
         console.dir(taskInfo);
         console.dir(payload);
         sendRequest(payload);
      });
   });
