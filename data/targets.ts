import * as flipted from "./fliptedCmd";
import * as service from "../src/target/targetService";

async function listItems() {
   const course = "Integrated Science";

   try {
      const targets = await service.listTargetsByCourse(course);
      console.table(targets);
      console.log(`Total: ${targets.length} target items.`);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "target",
   desc: "Access target APIs",
   actionMap: actionMap
};

const targetCmd = flipted.cmdFactory(cmdArgs);

export default targetCmd;
