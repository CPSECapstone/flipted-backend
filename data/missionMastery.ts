import { Arguments } from "yargs";
import * as util from "./util";
import * as flipted from "./fliptedCmd";
import * as missionMasteryService from "../src/missionMastery/missionMasteryService";
import * as helper from "../src/missionMastery/missionMasteryHelper";
import * as rosterService from "../src/course/courseService";
import { StudentMissionMasteryItem } from "../src/missionMastery/missionMasteryInterface";
import taskService from "../src/task/task.service";

async function listItems(args: Arguments<flipted.IAction>) {
   if (!args.missionId) {
      console.log("Missing --missionId=xxx");
      return;
   }

   try {
      const output = await missionMasteryService.listMissionMastery(args.missionId);
      console.table(output);
      console.log(`Total: ${output.length} mission mastery items.`);
   } catch (err) {
      console.log(err);
   }
}

function generateStudentMissionMasteryItems(
   students: Student[],
   tasks: Task[]
): StudentMissionMasteryItem[] {
   const masteryItems: Array<StudentMissionMasteryItem> = [];

   const taskMap: Map<string, Array<Task>> = new Map();
   tasks.forEach(task => {
      if (!task.missionId) {
         return;
      }
      if (taskMap.has(task.missionId)) {
         taskMap.get(task.missionId)!.push(task);
      } else {
         taskMap.set(task.missionId, [task]);
      }
   });

   for (let [missionId, tasks] of taskMap) {
      students.map(student => {
         const input: StudentMissionMasteryInput = {
            missionId,
            studentId: student.studentId,
            currentTaskId: tasks[0].id,
            level: util.randomInt(1, 10),
            progress: Math.random()
         };
         const item = helper.missionMasteryInputToDBItem(input);
         masteryItems.push(item);
      });
   }

   return masteryItems;
}

async function importItems(args: Arguments<flipted.IAction>) {
   try {
      const students: Student[] = await rosterService.listStudentsByCourse(args.course);
      console.table(students);
      const tasks: Task[] = await taskService.listTasksByCourse(args.course);
      console.table(tasks);
      const mastertItems = generateStudentMissionMasteryItems(students, tasks);
      console.table(mastertItems);

      const output = await missionMasteryService.importItems(mastertItems);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await missionMasteryService.deleteItems();
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("getFn", listItems);
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);
actionMap.set("deleteFn", deleteItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "missionMastery",
   desc: "Access missionMastery APIs",
   actionMap: actionMap
};

const courseCmd = flipted.cmdFactory(cmdArgs);

export default courseCmd;
