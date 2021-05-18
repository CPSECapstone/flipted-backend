import { Arguments } from "yargs";
import * as flipted from "./fliptedCmd";
import userService from "../src/services/user";

async function listItems(args: Arguments<flipted.IAction>) {
   const role = args.role || "student";

   try {
      const students = await userService.listUsersByRole(role);
      console.table(students);
      console.log(`Total: ${students.length} roster items.`);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "user",
   desc: "Access user APIs",
   actionMap: actionMap
};

const userCmd = flipted.cmdFactory(cmdArgs);

export default userCmd;
