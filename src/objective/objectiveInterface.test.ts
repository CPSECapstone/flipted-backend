import { ObjectiveKey } from "./objectiveInterface";

describe("Test Objective Interfaces", () => {
   it("will produce right parition key format", () => {
      const expected = `OBJECTIVE#objectiveId`;
      const actual = ObjectiveKey("objectiveId");
      expect(actual).toEqual(expected);
   });

   it("will produce right sort key format", () => {
      const expected = `OBJECTIVE#objectiveId`;
      const actual = ObjectiveKey("objectiveId");
      expect(actual).toEqual(expected);
   });
});
