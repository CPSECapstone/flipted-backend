import parse from "csv-parse/lib/sync";
import { readFile } from "fs/promises";
import { Arguments } from "yargs";
import * as flipted from "./fliptedCmd";
import * as util from "./util";
import taskService from "../src/services/task";
import * as taskblockService from "../src/taskblock/taskblockService";
import * as helper from "../src/taskblock/taskblockHelper";
import { TaskBlockItem } from "../src/taskblock/taskblockInterface";

async function listItems() {
   try {
      const output = await taskblockService.listTaskBlocks();
      console.table(output, ["PK", "SK", "title", "points"]);
      console.log(`Total: ${output.length} taskblock items.`);
   } catch (err) {
      console.log(err);
   }
}

async function readTaskBlocksFromCSV(filePath: string): Promise<any> {
   try {
      const buff = await readFile(filePath);
      const records = parse(buff.toString(), {
         columns: true,
         skip_empty_lines: true
      });
      return records;
   } catch (err) {
      console.log(err);
      return err;
   }
}

function readFrBlock(data: any, taskId: string): TaskBlockItem {
   const input = <FrBlockInput>{
      taskId: taskId,
      title: data.Title,
      pageIndex: parseInt(data.Page) - 1,
      blockIndex: 1,
      stem: data["Question Stem"],
      points: util.randomInt(1, 10),
      answer: ""
   };

   return helper.frBlockInputToDBItem(input);
}

function readMcBlock(data: any, taskId: string): TaskBlockItem {
   const input = <McBlockInput>{
      taskId: taskId,
      title: data.Title,
      pageIndex: parseInt(data.Page) - 1,
      blockIndex: 1,
      stem: data["Question Stem"],
      points: util.randomInt(1, 10),
      options: [data["Option 1"], data["Option 2"], data["Option 3"], data["Option 4"]],
      answers: []
   };

   return helper.mcBlockInputToDBItem(input);
}

function readTextBlock(data: any, taskId: string): TaskBlockItem {
   const input = <TextBlockInput>{
      taskId: taskId,
      title: data.Title,
      pageIndex: parseInt(data.Page) - 1,
      blockIndex: 1,
      contents: data.Text,
      fontSize: 12
   };

   return helper.textblockInputToDBItem(input);
}

function readImageBlock(data: any, taskId: string): TaskBlockItem {
   const input = <ImageBlockInput>{
      taskId: taskId,
      title: data.Title,
      pageIndex: parseInt(data.Page) - 1,
      blockIndex: 1,
      imageUrl: data["Media Link"]
   };

   return helper.imageblockInputToDBItem(input);
}

function readVideoBlock(data: any, taskId: string): TaskBlockItem {
   const input = <VideoBlockInput>{
      taskId: taskId,
      title: data.Title,
      pageIndex: parseInt(data.Page) - 1,
      blockIndex: 1,
      videoUrl: data["Media Link"]
   };

   return helper.videoblockInputToDBItem(input);
}

function generateTaskBlockItems(records: any[], tasks: Task[]): TaskBlockItem[] {
   const map: Map<string, string> = new Map();
   tasks.forEach(task => {
      map.set(task.name, task.id);
   });

   const blockItems: TaskBlockItem[] = [];

   console.log(records);
   records.forEach(record => {
      const taskName = record.Task || "unknown task";
      const taskId = map.get(taskName) || "unknown task";
      const type = record.Type;

      if (type === "Fill in the Blank") {
         blockItems.push(readFrBlock(record, taskId));
      } else if (type === "Free Response") {
         blockItems.push(readFrBlock(record, taskId));
      } else if (type === "MCQ") {
         blockItems.push(readMcBlock(record, taskId));
      } else if (type === "Text") {
         blockItems.push(readTextBlock(record, taskId));
      } else if (type === "Image") {
         blockItems.push(readImageBlock(record, taskId));
      } else if (type === "Video") {
         blockItems.push(readVideoBlock(record, taskId));
      }
   });

   return blockItems;
}

async function importItems(args: Arguments<flipted.IAction>) {
   const filePath = args.input || "data/taskblocks.csv";
   const course = "Integrated Science";

   try {
      const records = await readTaskBlocksFromCSV(filePath);
      const tasks = await taskService.listTasksByCourse(course);
      const blocks: TaskBlockItem[] = generateTaskBlockItems(records, tasks);
      console.table(blocks, ["SK", "title", "pageIndex", "blockIndex", "points"]);
      // const output = await taskblockService.importBlocks(blocks);
      // console.log(output);
   } catch (err) {
      console.log(err);
      return err;
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "taskblock",
   desc: "Access taskblock APIs",
   actionMap: actionMap
};

const taskblockCmd = flipted.cmdFactory(cmdArgs);

export default taskblockCmd;
