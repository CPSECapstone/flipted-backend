import { TaskProgressInput, TaskProgressItem } from "../../src/interfaces/taskInterfaces";
import { taskProgressInputToDBItem } from "../../src/services/taskSubmissionHelper";

describe("converting a TaskProgressInput to a TaskProgressItem", () => {
   it("will do so as expected without errors", async () => {
      
      const input: TaskProgressInput = {
         taskId: "TASK_ID#12345",
         finishedRequirementIds: ["XYZ", "123"]
      }

      const username = "fliptedEdRoXX"

      const expectedOutput: TaskProgressItem = {
         PK: "TASK_PROGRESS#" + username,
         SK: "TASK_ID#12345",
         username: "fliptedEdRoXX",
         finishedRequirementIds: ["XYZ", "123"]
      }

      expect(taskProgressInputToDBItem(input, username)).toEqual(expectedOutput);
   });
});
