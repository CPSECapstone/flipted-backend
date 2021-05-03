import { ObjectivePK, ObjectiveSK } from "../../src/interfaces/objective";

describe("Test Objective Interfaces", () => {
   it("will produce right parition key format", () => {
      const expected = `COURSE#Science`;
      const actual = ObjectivePK("Science");
      expect(actual).toEqual(expected);
   });

   it("will produce right sort key format", () => {
      const expected = `OBJECTIVE#objectiveId`;
      const actual = ObjectiveSK("objectiveId");
      expect(actual).toEqual(expected);
   });
});
