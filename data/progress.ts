import { Arguments } from "yargs";
import * as util from "./util";
import * as flipted from "./fliptedCmd";
import * as progressService from "../src/progress/progressService";
import * as rosterService from "../src/roster/rosterService";
import * as objectiveService from "../src/objective/objectiveService";
import taskService from "../src/services/task";
import { MasteryItem } from "../src/progress/progressInterface";
import { ObjectiveItem } from "../src/objective/objectiveInterface";
import { createMasteryItem } from "../src/submissions/taskSubmissionHelper";

async function listItems(args: Arguments<flipted.IAction>) {
   try {
      const masteryItems = await progressService.listAllByCourse(args.course);
      console.table(masteryItems, ["username", "taskId", "objectiveId", "mastery"]);
      console.log(`Total: ${masteryItems.length} target items.`);
   } catch (err) {
      console.log(err);
   }
}

function generateMasterItems(
   course: string,
   students: Array<Student>,
   tasks: Array<Task>,
   objectiveItems: Array<ObjectiveItem>
): Array<MasteryItem> {
   const taskMap: Map<string, Task> = new Map();
   tasks.forEach(task => {
      taskMap.set(task.id, task);
   });

   const masteryStatusList = ["NOT_GRADED", "NOT_MASTERED", "NEARLY_MASTERED", "MASTERED"];

   const masterItems: Array<MasteryItem> = [];

   students.forEach(student => {
      objectiveItems.forEach(objectiveItem => {
         if (util.randomInt(1, 10) > 2) {
            return;
         }

         objectiveItem.taskIds.forEach(taskId => {
            let masteryItem: MasteryItem = createMasteryItem(
               student.studentId,
               course,
               taskId,
               objectiveItem.objectiveId
            );

            masteryItem.mastery = masteryStatusList[util.randomInt(0, 3)];
            masterItems.push(masteryItem);
         });
      });
   });

   return masterItems;
}

// username: string;
// taskId: string;
// objectiveId: string;
// course: string;
// mastery: string; // maps to the mastery enum
// source?: string;
async function importItems(args: Arguments<flipted.IAction>) {
   try {
      const students = await rosterService.listStudentsByCourse(args.course);
      const tasks = await taskService.listTasksByCourse(args.course);
      const objectiveItems = await objectiveService.listObjectiveItemsByCourse(args.course);

      const masteryItems: Array<MasteryItem> = generateMasterItems(
         args.course,
         students,
         tasks,
         objectiveItems
      );
      console.table(masteryItems, ["username", "taskId", "objectiveId", "mastery"]);
      const output = await progressService.importItems(masteryItems);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await progressService.deleteItems();
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);
actionMap.set("deleteFn", deleteItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "progress",
   desc: "Access progress APIs",
   actionMap: actionMap
};

const progressCmd = flipted.cmdFactory(cmdArgs);

export default progressCmd;
