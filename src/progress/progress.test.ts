import * as service from "./progressService";

// talk to the real db
describe("addProgress method", () => {
   it("should delete progress item", async () => {
      const progress: ProgressInput = {
         userName: "Test User",
         course: "Test Course",
         taskId: "test taskId",
         status: false
      };
      await service.addProgress(progress);

      const expected: UserProgress = {
         userName: "Test User",
         progress: [
            {
               taskId: "test taskId",
               status: false
            }
         ]
      };

      const actual = await service.getUserProgress("Test User", "Test Course");

      expect(expected).toEqual(actual);

      const input: ProgresssDeletionInput = {
         userName: "Test User",
         course: "Test Course",
         taskId: "test taskId"
      };
      await service.deleteProgress(input);
   });
});
