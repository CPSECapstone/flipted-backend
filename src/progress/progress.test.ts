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

      const expected: UserProgress = {
         userName: "Test User",
         progress: [
            {
               taskId: "test taskId",
               status: false
            }
         ]
      };

      const input: ProgresssDeletionInput = {
         userName: "Test User",
         course: "Test Course",
         taskId: "test taskId"
      };

      return service.addProgress(progress).then((result: string) => {
         expect(result).toEqual(progress.taskId);
         return service.getUserProgress("Test User", "Test Course").then(actual => {
            expect(expected).toEqual(actual);
            return service.deleteProgress(input);
         });
      });
   });
});
