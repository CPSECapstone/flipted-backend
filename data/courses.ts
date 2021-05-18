import * as flipted from "./fliptedCmd";
import * as service from "../src/course/courseService";

async function listItems() {
   try {
      const output = await service.listCourseInfos("Mr. Butcher");
      console.table(output);
      console.log(`Total: ${output.length} course items.`);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();

actionMap.set("listFn", listItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "course",
   desc: "Access course APIs",
   actionMap: actionMap
};

const courseCmd = flipted.cmdFactory(cmdArgs);

export default courseCmd;
