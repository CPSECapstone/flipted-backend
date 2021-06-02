import * as flipted from "./fliptedCmd";
import * as util from "./util";
import { Arguments } from "yargs";
import taskService from "../src/task/task.service";
import * as missionService from "../src/mission/missionService";
import { TaskItem } from "../src/interfaces/task";
import taskBusLogic from "../src/task/taskBusLogic";

async function getItem(args: Arguments<flipted.IAction>) {
   if (!args.id) {
      console.log("Missing --id=xxx");
   }

   const taskId = args.id;

   try {
      const task: Task = await taskService.getTaskInfoById(taskId!);
      console.log(JSON.stringify(task, null, "  "));
   } catch (err) {
      console.log(err);
   }
}

async function listItems(args: Arguments<flipted.IAction>) {
   try {
      let tasks: Task[] = [];
      if (args.missionId) {
         tasks = await taskService.listTasksByMissionId(args.missionId);
      } else {
         // default - list by course
         tasks = await taskService.listTasksByCourse(args.course!);
      }
      console.table(tasks, ["id", "name", "missionId", "missionIndex", "pages"]);
      console.log(`Total: ${tasks.length} task items.`);
   } catch (err) {
      console.log(err);
   }
}

function generatePageMap(records: any[]): Map<string, number> {
   const map: Map<string, number> = new Map();
   records.forEach((record: any) => {
      const taskName = record.Task;
      const oldPage = map.get(taskName) || -1;
      const page = parseInt(record.Page);
      map.set(taskName, page > oldPage ? page : oldPage);
   });

   return map;
}

function generateTaskItems(records: any[]): TaskItem[] {
   const taskItems: TaskItem[] = records.map((record: any) => {
      const input: TaskInput = {
         name: record.TaskName,
         instructions: record.Instructions,
         points: parseInt(record.Points),
         requirements: [
            {
               description: record.Requirements
            }
         ],
         pages: [{ skippable: true }],
         course: record.Course,
         missionId: record.MissionId,
         missionIndex: parseInt(record.MissionIndex)
      };

      const taskItem = taskBusLogic.convertTaskInputToTaskItem(input);
      return taskItem;
   });

   return taskItems;
}

async function importItems(args: Arguments<flipted.IAction>) {
   const filePath = args.input || "data/tasks.csv";

   try {
      const taskblockRecords = await util.readFromCSV("data/taskblocks.csv");
      const pageMap: Map<string, number> = generatePageMap(taskblockRecords);

      const records = await util.readFromCSV(filePath);
      const taskItems: TaskItem[] = generateTaskItems(records);

      const missions: Mission[] = await missionService.listByCourse(args.course);
      const lenOfMisssions = missions.length;

      // randomly assign a missionId and missionIndexto task
      taskItems.forEach(task => {
         const randomIndex = util.randomInt(0, lenOfMisssions - 1);
         task.missionId = missions[randomIndex].id;
         task.missionIndex = randomIndex;
      });

      taskItems.forEach(taskItem => {
         if (pageMap.has(taskItem.name)) {
            const pageNum = pageMap.get(taskItem.name);
            taskItem.pages = Array(pageNum).fill(false);
         }
      });

      console.table(taskItems, ["id", "name", "pages", "missionId", "missionIndex"]);
      const output = await taskService.importTasks(taskItems);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await taskService.deleteTasks();
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
   name: "task",
   desc: "Access task APIs",
   actionMap: actionMap
};

const taskCmd = flipted.cmdFactory(cmdArgs);

export default taskCmd;
