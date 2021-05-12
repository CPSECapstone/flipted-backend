import * as service from "./progressService";
import * as progressMocks from "./mocks"
import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";
import { generateMissionProgress } from "./progressHelper";

describe("Generating mission progress for each mission in a course", () => {
   it("Should display task submission progress in task stats when it exists", async () => {
      const missions: Mission[] = [progressMocks.mockMission_1, progressMocks.mockMission_2]
      const tasks: Task[] = progressMocks.mockTasks
      const taskSubmissionItems: TaskSubmissionResultItem[] = progressMocks.mockTaskSubmissionItems

      expect(generateMissionProgress(missions, tasks, taskSubmissionItems)).toEqual(progressMocks.mockMissionProgress)
   });
});
