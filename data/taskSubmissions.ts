import { Arguments } from "yargs";
import taskSubmissionService from "../src/submissions/taskSubmission";
import * as flipted from "./fliptedCmd";

async function listItems(args: Arguments<flipted.IAction>) {
   if (!args.taskId) {
      console.log("Missing --taskId=xxx");
      return;
   }

   try {
      let summary: TaskSubmissionSummary = await taskSubmissionService.listAllSubmissionsByCourse(
         args.course,
         args.taskId
      );
      console.log(JSON.stringify(summary.task, null, "  "));

      console.table(summary.results, [
         "studentName",
         "studentId",
         "pointsAwarded",
         "graded",
         "submitted"
      ]);
      console.log(`Total: ${summary.results.length} submission items.`);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "taskSubmission",
   desc: "Access taskSubmissions APIs",
   actionMap: actionMap
};

const taskCmd = flipted.cmdFactory(cmdArgs);

export default taskCmd;
