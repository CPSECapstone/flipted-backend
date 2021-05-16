import csv from "csv-parser";
import fs from "fs";
import { readFile } from "fs/promises";
import yargs from "yargs";
import chalk from "chalk";

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

async function listItems() {
   const course = "Integrated Science";
   try {
      const output = await objectiveService.listObjectivesByCourse(course);
      const toPrint = output.map(objective => {
         return {
            objectiveId: objective.objectiveId,
            objectiveName: objective.objectiveName,
            targetId: objective.targetId,
            targetName: objective.targetName
         };
      });

      console.table(toPrint);
      console.log(`Total: ${output.length} objective items.`);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await objectiveService.deleteObjectives();
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function importItems() {
   try {
      const objectives = await generateObjectiveInputs();
      const output = await objectiveService.batchWriteObjectives(objectives);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function addItem(args: Array<string | number>) {
   if (args.length < 3) {
      console.log(`Usage: flipted objective add json_file_path`);
      return;
   }

   try {
      const buffer = await readFile(args[2] as string);
      const rawData = JSON.parse(buffer.toString());
      const objective = <ObjectiveInput>rawData.objective;
      console.table(objective);
      const output = await objectiveService.addObjective(objective);
      console.log(chalk.green(`Objective added. ${output}`));
   } catch (err) {
      console.log(chalk.red(err));
   }
}

const actionMap: Map<string | number, (args: Array<string | number>) => void> = new Map();
actionMap.set("list", listItems);
actionMap.set("delete", deleteItems);
actionMap.set("import", importItems);
actionMap.set("add", addItem);

const objectiveCmd: yargs.CommandModule<{}, {}> = {
   command: "objective",
   handler: args => {
      const [name, action] = args._;
      if (!actionMap.has(action)) {
         console.log(`unsupported action: ${name} ${action}.`);
      } else {
         const fn = actionMap.get(action);
         fn!(args._);
      }
   },
   describe: "Import Objectives from objectives.csv"
};

export default objectiveCmd;
