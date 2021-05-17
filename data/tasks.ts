import * as flipted from "./fliptedCmd";
import taskService from "../src/services/task";

async function listItems() {
   const course = "Integrated Science";

   try {
      const output = await taskService.listTasksByCourse(course);
      console.table(output, ["id", "name"]);
      console.log(`Total: ${output.length} task items.`);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();

actionMap.set("listFn", listItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "task",
   desc: "Access task APIs",
   actionMap: actionMap
};

const taskCmd = flipted.cmdFactory(cmdArgs);

export default taskCmd;
