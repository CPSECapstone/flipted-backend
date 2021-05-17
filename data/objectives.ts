import csv from "csv-parser";
import fs from "fs";
import { readFile } from "fs/promises";
import { Arguments } from "yargs";
import chalk from "chalk";
import * as flipted from "./fliptedCmd";
import taskService from "../src/services/task";
import * as objectiveService from "../src/objective/objectiveService";
import * as util from "./util";

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

async function generateObjectiveInputs() {
   const objectives: ObjectiveInput[] = await readObjectivesFromCSV();
   const tasks: Task[] = await readTasksFromDB("Integrated Science");
   const lenOfTasks = tasks.length;

   objectives.forEach(objective => {
      const numberOfTask = util.randomInt(2, 5);
      const set: Set<string> = new Set();

      // random may give the same number
      for (let i = 0; i < numberOfTask; i++) {
         const taskIndex = util.randomInt(0, lenOfTasks - 1);
         set.add(tasks[taskIndex].id);
      }

      objective.taskIds = Array.from(set.values());
   });

   return objectives;
}

async function listItems() {
   const course = "Integrated Science";
   try {
      const output = await objectiveService.listObjectivesByCourse(course);
      console.table(output, ["objectiveId", "objectiveName"]);
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

async function addItem(args: Arguments<flipted.IAction>) {
   if (!args.input) {
      console.log("Missing --input=json_file_path");
      return;
   }

   try {
      const buffer = await readFile(args.input);
      const rawData = JSON.parse(buffer.toString());
      const objective = <ObjectiveInput>rawData.objective;
      console.table(objective);
      const output = await objectiveService.addObjective(objective);
      console.log(chalk.green(`Objective added. ${output}`));
   } catch (err) {
      console.log(chalk.red(err));
   }
}

async function getItem(args: Arguments<flipted.IAction>) {
   if (!args.id) {
      console.log("Missing --id=xxx");
      return;
   }

   try {
      const output = await objectiveService.getObjectiveById(args.id);
      console.dir(output);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("addFn", addItem);
actionMap.set("getFn", getItem);
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);
actionMap.set("deleteFn", deleteItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "objective",
   desc: "Access objective APIs",
   actionMap: actionMap
};

const objectiveCmd = flipted.cmdFactory(cmdArgs);

export default objectiveCmd;
