import dynamodbMock from '../__mocks__/dynamodb';
import dynamodb from '../../src/services/dynamodb';
import { mocked } from 'ts-jest/utils';

import learningObjectiveService from '../../src/services/learningObjective';
import { LearningObjectiveInput } from '../../src/interfaces';
import taskBusLogic from '../../src/buslogic/taskBusLogic';
import { Task, TaskProgress } from '../../src/interfaces/taskInterfaces';

const mockDate: Date = new Date(0)
const sampleTask: Task = {
   startAt: mockDate,
   endAt: mockDate,
   dueDate: mockDate,
   objectiveId: "0",
   id: "0",
   name: "Destin's Awesome Task",
   instructions: "If you're seeing these instructions, congrats! You've discovered my task! Message me on slack for a reward.",
   subMissionId: "sub-mission 1",
   points: 10,
   pages: [
      {
         skippable: true,
         blocks: [
               {
                  title: "Welcome to the first page",
                  contents: "This is the contexts of a text block. You can put your random text here. Since this is my awesome task, you get to read the awesome contents of this text block.",
                  fontSize: 14,
                  requirement: {
                     id: "0",
                     description: "Fully read this text block",
                     isComplete: false,
                  }
               },
               {
                  title: "Check Out This Cute Puppy",
                  imageUrl: "https://i.imgur.com/tmawqgH.jpg",
                  requirement: {
                     id: "1",
                     description: "Fully appreciate this puppy",
                     isComplete: false,
                  }
               },
               {
                  title: "And Also This Video",
                  videoUrl: "https://youtu.be/F4we73GHH9k",
                  requirement: {
                     id: "2",
                     description: "Finish this video",
                     isComplete: false,
                  }
               }
            ]
      },
      {
         skippable: false,
         blocks: [
            {
               title: "Welcome to the second page",
               contents: "I appreciate you for reading this far. Have a nice day.",
               fontSize: 14,
               requirement: {
                  id: "3",
                  description: "Aknowledge my appreciation.",
                  isComplete: false,
                  pointValue: 1
               }
            }
         ]
      }
   ]
 }

jest.mock('../../src/services/dynamodb', () => {
  return dynamodbMock;
});

describe('querying a task with existing task progress' , () => {
   it('will set the isComplete field of any rubric requirement in a task block if its contained in the task progress object', async () => {

      const taskSubmission: TaskProgress = {
         finishedBlockIds: ["0", "2", "3"],
         userId: "0",
         taskId: "0"
      }

      const modifiedTask: Task = taskBusLogic.applyTaskProgress(sampleTask, taskSubmission)
      
      // every task but the image task complete
      const expectedOutput: Task = JSON.parse(JSON.stringify(sampleTask));
      expectedOutput.pages[0].blocks[0].requirement.isComplete = true
      expectedOutput.pages[0].blocks[2].requirement.isComplete = true
      expectedOutput.pages[1].blocks[0].requirement.isComplete = true

      expect(modifiedTask.pages[0].blocks[0].requirement.isComplete).toBeTruthy()
      expect(modifiedTask.pages[0].blocks[2].requirement.isComplete).toBeTruthy()
      expect(modifiedTask.pages[1].blocks[0].requirement.isComplete).toBeTruthy()

      expect(modifiedTask.pages[0].blocks[1].requirement.isComplete).toBeFalsy()
     });

     it('will otherwise not modify the object', async () => {

      const taskSubmission: TaskProgress = {
         finishedBlockIds: [],
         userId: "0",
         taskId: "0"
      }

      var modifiedTask: Task = taskBusLogic.applyTaskProgress(sampleTask, taskSubmission)
      modifiedTask = JSON.parse(JSON.stringify(modifiedTask))
      // every task but the image task complete
      expect(modifiedTask).toMatchObject(JSON.parse(JSON.stringify(sampleTask)))
     });
});

describe('submitting progress to a task', () => {
  it('will verify task progress submission ids are valid', async () => {

   const taskSubmission: TaskProgress = {
      finishedBlockIds: ["0", "1"],
      userId: "0",
      taskId: "0"
   }
   
    expect(taskBusLogic.areTaskProgressIdsValid(sampleTask, taskSubmission)).toBeTruthy()
  });

  it('will fail to verify task progress if not all submission ids match', async () => {

   const taskSubmission: TaskProgress = {
      finishedBlockIds: ["0", "4"],
      userId: "0",
      taskId: "0"
   }
   
    expect(taskBusLogic.areTaskProgressIdsValid(sampleTask, taskSubmission)).toBeFalsy()
  });

  it('will fail to verify task progress if there are too many ids attached to the submission', async () => {

   const taskSubmission: TaskProgress = {
      finishedBlockIds: ["0", "1", "2", "3", "3"],
      userId: "0",
      taskId: "0"
   }
   
    expect(taskBusLogic.areTaskProgressIdsValid(sampleTask, taskSubmission)).toBeFalsy()
  });

  
});
