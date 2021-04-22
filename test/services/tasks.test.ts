import dynamodbMock from "../__mocks__/dynamodb";
import taskBusLogic from "../../src/services/taskBusLogic";
import { Task, TaskProgress} from "../../src/interfaces/taskInterfaces";
import { TaskProgressInput } from "../../src/interfaces/taskSubmission";

const mockDate: Date = new Date(0);
const sampleTask = {
   startAt: mockDate,
   endAt: mockDate,
   dueDate: mockDate,
   objectiveId: "0",
   id: "0",
   name: "Destin's Awesome Task",
   instructions:
      "If you're seeing these instructions, congrats! You've discovered my task! Message me on slack for a reward.",
   subMissionId: "sub-mission 1",
   points: 10,
   requirements: [
      {
         id: "0",
         description: "Req 0",
         isComplete: false
      },
      {
         id: "1",
         description: "Req 1",
         isComplete: false
      },
      {
         id: "2",
         description: "Req 2",
         isComplete: false
      },
      {
         id: "3",
         description: "Req 3",
         isComplete: false
      }
   ],
   pages: [
      {
         skippable: true,
         blocks: [
            {
               blockId: "1",
               pageIndex: 0,
               blockIndex: 0,
               title: "Welcome to the first page",
               contents:
                  "This is the contexts of a text block. You can put your random text here. Since this is my awesome task, you get to read the awesome contents of this text block.",
               fontSize: 14
            },
            {
               blockId: "2",
               pageIndex: 0,
               blockIndex: 1,
               title: "Check Out This Cute Puppy",
               imageUrl: "https://i.imgur.com/tmawqgH.jpg"
            },
            {
               blockId: "3",
               pageIndex: 0,
               blockIndex: 2,
               title: "And Also This Video",
               videoUrl: "https://youtu.be/F4we73GHH9k"
            }
         ]
      },
      {
         skippable: false,
         blocks: [
            {
               blockId: "4",
               pageIndex: 1,
               blockIndex: 0,
               title: "Welcome to the second page",
               contents: "I appreciate you for reading this far. Have a nice day.",
               fontSize: 14
            }
         ]
      }
   ]
};

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

describe("querying a task with existing task progress", () => {
   it("will set the isComplete field of any rubric requirement in a task block if its contained in the task progress object", async () => {
      const taskSubmission: TaskProgress = {
         finishedRequirementIds: ["0", "2", "3"],
         username: "0",
         taskId: "0"
      };
      const typedTask: Task = sampleTask;
      const modifiedTask: Task = taskBusLogic.applyTaskProgress(typedTask, taskSubmission);

      // every task but the image task complete
      const expectedOutput: Task = JSON.parse(JSON.stringify(sampleTask));
      expectedOutput.requirements[0].isComplete = true;
      expectedOutput.requirements[2].isComplete = true;
      expectedOutput.requirements[3].isComplete = true;

      expect(modifiedTask.requirements[0].isComplete).toBeTruthy();
      expect(modifiedTask.requirements[2].isComplete).toBeTruthy();
      expect(modifiedTask.requirements[3].isComplete).toBeTruthy();

      expect(modifiedTask.requirements[1].isComplete).toBeFalsy();
   });

   it("will otherwise not modify the object", async () => {
      const taskSubmission: TaskProgress = {
         finishedRequirementIds: [],
         username: "0",
         taskId: "0"
      };

      var modifiedTask: Task = taskBusLogic.applyTaskProgress(sampleTask, taskSubmission);
      modifiedTask = JSON.parse(JSON.stringify(modifiedTask));
      expect(modifiedTask).toMatchObject(JSON.parse(JSON.stringify(sampleTask)));
   });
});

describe("Verifying a task progress submission", () => {
   it("will properly verify task progress if submission ids are valid", async () => {
      const taskSubmission: TaskProgressInput = {
         finishedRequirementIds: ["0", "1"],
         taskId: "0"
      };

      expect(taskBusLogic.areTaskProgressIdsValid(sampleTask, taskSubmission)).toBeTruthy();
   });

   it("will fail to verify task progress if not all submission ids match", async () => {
      const taskSubmission: TaskProgressInput = {
         finishedRequirementIds: ["0", "4"],
         taskId: "0"
      };

      expect(taskBusLogic.areTaskProgressIdsValid(sampleTask, taskSubmission)).toBeFalsy();
   });

   it("will fail to verify task progress if there are too many ids attached to the submission", async () => {
      const taskSubmission: TaskProgressInput = {
         finishedRequirementIds: ["0", "1", "2", "3", "3"],
         taskId: "0"
      };

      expect(taskBusLogic.areTaskProgressIdsValid(sampleTask, taskSubmission)).toBeFalsy();
   });
});
