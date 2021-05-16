const csv = require("csv-parser");
const fs = require("fs");

import taskService from "../src/services/task";
import * as objectiveService from "../src/objective/objectiveService";

async function readObjectivesFromCSV(): Promise<ObjectiveInput[]> {
   const objectives: ObjectiveInput[] = [];
   await fs
      .createReadStream("data/objectives.csv")
      .pipe(csv({ quote: '"' }))
      .on("data", (data: any) => {
         const objective: ObjectiveInput = {
            objectiveName: data.ObjectiveName,
            description: data.Description,
            targetId: data.TargetId,
            targetName: data.TargetName,
            course: data.Course,
            taskIds: []
         };
         objectives.push(objective);
      })
      .on("end", () => {
         console.log(`readObjectivesFromCSV: total of ${objectives.length} objectives items.`);
      });

   return objectives;
}

async function readTasksFromDB(course: string): Promise<Task[]> {
   const tasks: Task[] = await taskService.listTasksByCourse(course);
   console.log(`readTasksFromDB: total of ${tasks.length} task items.`);
   return tasks;
}

function randomInt(min: number, max: number) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateObjectiveInputs() {
   const objectives: ObjectiveInput[] = await readObjectivesFromCSV();
   const tasks: Task[] = await readTasksFromDB("Integrated Science");
   const lenOfTasks = tasks.length;

   objectives.forEach(objective => {
      const taskIds: string[] = [];
      const numberOfTask = randomInt(2, 5);
      for (let i = 0; i < numberOfTask; i++) {
         const taskIndex = randomInt(0, lenOfTasks - 1);
         taskIds.push(tasks[taskIndex].id);
      }

      objective.taskIds = taskIds;
   });

   return objectives;
}

async function main() {
   try {
      await objectiveService.deleteObjectives();
      const objectives = await generateObjectiveInputs();
      await objectiveService.batchWriteObjectives(objectives);
   } catch (err) {
      console.log(err);
   }
}

main();
