import * as util from "./util";
import { Arguments } from "yargs";
import * as flipted from "./fliptedCmd";
import taskService from "../src/task/task.service";
import * as objectiveService from "../src/objective/objectiveService";
import * as targetService from "../src/target/targetService";
import * as helper from "../src/objective/objectiveHelper";
import { ObjectiveItem } from "../src/objective/objectiveInterface";

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

async function listItems(args: Arguments<flipted.IAction>) {
   try {
      const objectives = await objectiveService.listObjectivesByCourse(args.course);
      console.table(objectives, [
         "objectiveId",
         "objectiveName",
         "targetId",
         "targetName",
         "taskIds"
      ]);
      console.log(`Total: ${objectives.length} objective items.`);
   } catch (err) {
      console.log(err);
   }
}

async function readTargetsFromDB(course: string): Promise<Target[]> {
   const targets: Target[] = await targetService.listTargetsByCourse(course);
   console.log(`readTargetsFromDB: total of ${targets.length} target items.`);
   return targets;
}

async function readTasksFromDB(course: string): Promise<Task[]> {
   const tasks: Task[] = await taskService.listTasksByCourse(course);
   console.log(`readTasksFromDB: total of ${tasks.length} task items.`);
   return tasks;
}

function generateObjectiveItems(records: any[], targets: Target[], tasks: Task[]): ObjectiveItem[] {
   const targetMap: Map<string, string> = new Map();
   targets.forEach(target => {
      targetMap.set(target.targetName, target.targetId);
   });
   const lenOfTasks = tasks.length;

   const objectiveItems: ObjectiveItem[] = records.map(record => {
      const numberOfTask = util.randomInt(2, 5);
      const set: Set<string> = new Set();

      // random may give the same number
      for (let i = 0; i < numberOfTask; i++) {
         const taskIndex = util.randomInt(0, lenOfTasks - 1);
         set.add(tasks[taskIndex].id);
      }

      const input: ObjectiveInput = {
         objectiveName: record.ObjectiveName,
         description: record.Description,
         targetId: targetMap.get(record.TargetName) || "",
         targetName: record.TargetName,
         course: record.Course,
         taskIds: Array.from(set.values())
      };

      return helper.objectiveInputToDBItem(input);
   });

   return objectiveItems;
}

async function importItems(args: Arguments<flipted.IAction>) {
   const filePath = "data/objectives.csv";

   try {
      const records = await util.readFromCSV(filePath);
      const targets: Target[] = await readTargetsFromDB(args.course);
      const tasks: Task[] = await readTasksFromDB(args.course);
      const objectives = generateObjectiveItems(records, targets, tasks);
      const output = await objectiveService.importItems(objectives);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await objectiveService.deleteItems();
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
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
