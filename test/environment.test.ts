import { environment, TABLE_NAME } from "../src/environment";

describe("Test environment variables", () => {
   it("will display correct `User` table name", () => {
      const expected = `flipted-${environment.databaseStage}-Users`;
      const actual = TABLE_NAME("Users");
      expect(actual).toEqual(expected);
   });

   it("will display correct `Tasks` table name", () => {
      const expected = `flipted-${environment.databaseStage}-Tasks`;
      const actual = TABLE_NAME("Tasks");
      expect(actual).toEqual(expected);
   });
});
