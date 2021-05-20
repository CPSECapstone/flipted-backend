import { Arguments } from "yargs";
import * as flipted from "./fliptedCmd";
import * as service from "../src/progress/progressService";

async function listItems(args: Arguments<flipted.IAction>) {
   try {
      const masteryItems = await service.listAllByCourse(args.course);
      console.table(masteryItems);
      console.log(`Total: ${masteryItems.length} target items.`);
   } catch (err) {
      console.log(err);
   }
}

async function importItems() {
   // todo
}

async function deleteItems(args: Arguments<flipted.IAction>) {
   try {
      const output = await service.deleteAllByCourse(args.course);
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
