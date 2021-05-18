import * as flipted from "./fliptedCmd";
import parse from "csv-parse/lib/sync";
import { readFile } from "fs/promises";
import { Arguments } from "yargs";
import taskService from "../src/services/task";
import { TaskItem } from "../src/interfaces/task";
import taskBusLogic from "../src/services/taskBusLogic";

async function getItem(args: Arguments<flipted.IAction>) {
   if (!args.id) {
      console.log("Missing --id=xxx");
   }

   const taskId = args.id;

   try {
      const task: Task = await taskService.getTaskById(taskId!);
      console.log(JSON.stringify(task, null, "  "));
   } catch (err) {
      console.log(err);
   }
}

async function listItems() {
   const course = "Integrated Science";

   try {
      const tasks: Task[] = await taskService.listTasksByCourse(course);
      console.table(tasks);
      console.log(`Total: ${tasks.length} task items.`);
   } catch (err) {
      console.log(err);
   }
}

async function readPagesFromCSV(filePath: string): Promise<Map<string, number>> {
   try {
      const buff = await readFile(filePath);
      const records = parse(buff.toString(), {
         columns: true,
         skip_empty_lines: true
      });

      const map: Map<string, number> = new Map();
      records.forEach((record: any) => {
         const taskName = record.Task;
         const oldPage = map.get(taskName) || -1;
         const page = parseInt(record.Page);
         map.set(taskName, page > oldPage ? page : oldPage);
      });

      return map;
   } catch (err) {
      console.log(err);
      return err;
   }
}

async function readTasksFromCSV(filePath: string): Promise<TaskItem[]> {
   try {
      const buff = await readFile(filePath);
      const records = parse(buff.toString(), {
         columns: true,
         skip_empty_lines: true
      });

      const taskItems: TaskItem[] = records.map((record: any) => {
         const input: TaskInput = {
            name: record.TaskName,
            instructions: record.Instructions,
            points: parseInt(record.Points),
            requirements: [],
            pages: [],
            course: record.Course,
            missionId: record.MissionId,
            missionIndex: parseInt(record.MissionIndex)
         };

         return taskBusLogic.convertTaskInputToTaskItem(input);
      });

      return taskItems;
   } catch (err) {
      console.log(err);
      return err;
   }
}

async function importItems(args: Arguments<flipted.IAction>) {
   const filePath = args.input || "data/tasks.csv";

   try {
      const pageMap: Map<string, number> = await readPagesFromCSV("data/taskblocks.csv");
      const taskItems: TaskItem[] = await readTasksFromCSV(filePath);

      taskItems.forEach(taskItem => {
         if (pageMap.has(taskItem.name)) {
            const pageNum = pageMap.get(taskItem.name);
            taskItem.pages = Array(pageNum).fill(false);
         }
      });
      console.table(taskItems, [
         "id",
         "name",
         "pages",
         "instructions",
         "missionId",
         "missionIndex"
      ]);
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
