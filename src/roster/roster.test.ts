import { studentInputToDBItem } from "./rosterHelper";
import { StudentItem, StudentPK, StudentSK } from "./rosterInterface";

describe("Converting to database keys", () => {
   it("Converts the PK", async () => {
      expect(StudentPK("id123")).toEqual("STUDENT#id123");
   });

   it("Converts the SK", async () => {
      expect(StudentSK("courseid")).toEqual("COURSE#courseid");
   });
});

describe("Creating a student", () => {
   it("Adds the correct fields", async () => {
      const input: StudentInput = {
         studentId: 'test',
         email: 'test@gmail.com',
         firstName: 'Joe',
         lastName: 'Baker',
         course: 'testCourse',
         section: 1
      }
      const expectedRes: StudentItem = {
         PK: StudentPK('test'),
         SK: StudentSK('testCourse'),
         studentId: 'test',
         email: 'test@gmail.com',
         firstName: 'Joe',
         lastName: 'Baker',
         course: 'testCourse',
         section: 1,
         points: 0,
         totalPointsAwarded: 0,
         totalPointsSpent: 0
      }
      expect(studentInputToDBItem(input)).toEqual(expectedRes);
   });
});

