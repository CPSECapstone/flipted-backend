import * as service from "./progressService";
import * as progressMocks from "./mocks"
import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";
import { generateMissionProgress, generateTargetProgress } from "./progressHelper";
import { ObjectiveItem } from "../objective/objectiveInterface";
import { MasteryItem } from "./progressInterface";

describe("Generating mission progress for each mission in a course", () => {
   it("Should display task submission progress in task stats when it exists", async () => {
      const missions: Mission[] = [progressMocks.mockMission_1, progressMocks.mockMission_2]
      const tasks: Task[] = progressMocks.mockTasks
      const taskSubmissionItems: TaskSubmissionResultItem[] = progressMocks.mockTaskSubmissionItems

      expect(generateMissionProgress(missions, tasks, taskSubmissionItems, "MOCKUSER_123")).toEqual(progressMocks.mockMissionProgress)
   });
});

describe("Generating learning target progress for each target in a course", () => {
   it("Should properly organize the input data into a list of progress items", async () => {
      const objectives: ObjectiveItem[] = progressMocks.mockObjectiveItems
      const targets: Target[] = [progressMocks.mockTarget_1, progressMocks.mockTarget_2]
      const masteryItems: MasteryItem[] = progressMocks.mockMasteryItems

      expect(generateTargetProgress(targets, objectives,  masteryItems, "MOCKUSER_123")).toEqual(progressMocks.mockTargetProgress)
   });
})
