import dynamodbMock from "../../test/__mocks__/dynamodb";
import { MARKETPLACE_TABLE } from "../environment";
import { COURSE_DATE_INDEX, ReceiptPK, purchaseDatePrefix } from "../marketplace/marketplace.interface";
import { studentInputToDBItem } from "./courseHelper";
import { StudentPK, StudentSK, StudentItem, TeacherPK, UserGI_PK, UserGI_SK, TeacherSK } from "./courseInterface";

jest.mock("../../src/services/dynamodb", () => {
   return dynamodbMock;
});

test("I can: create a course as an instructor", async () => {
   dynamodbMock.putComposite.mockClear();

});

test("I can: query all courses I'm managing / enrolled in", async () => {
   dynamodbMock.queryList.mockClear();

});

test("I can: add a student to a course", async () => {
   dynamodbMock.putComposite.mockClear();

});

test("I can: query all students in a course", async () => {
   dynamodbMock.queryList.mockClear();

});

test("I can: query a single student in a course", async () => {
   dynamodbMock.getCompositeDemarshall.mockClear();

});

test("Course - Student item SK", async () => {
   expect(StudentSK("id123")).toEqual("STUDENT#id123");
});

test("Course - Student item PK", async () => {
   expect(StudentPK("courseid123")).toEqual("COURSE#courseid123");
});

test("Course - Instructor (represents course) PK", async () => {
   expect(TeacherPK("courseid123")).toEqual("COURSE#courseid123");
});

test("Course - Instructor (represents course) SK", async () => {
   expect(TeacherSK("instId123")).toEqual("TEACHER#instId123");
});

test("User - Course (for querying all courses associated with user) PK", async () => {
   expect(UserGI_PK("id123")).toEqual("USER#id123");
});

test("User - Course (for querying all courses associated with user) SK", async () => {
   expect(UserGI_SK("course123")).toEqual("COURSE#course123");
});



describe("Creating a student", () => {
   it("Adds the correct fields", async () => {
      const input: StudentInput = {
         studentId: 'test',
         firstName: 'Joe',
         lastName: 'Baker',
         courseId: 'course123',
         instructorId: 'jones123'
      }
      const expectedRes: StudentItem = {
         PK: StudentPK('test'),
         SK: StudentSK('course123'),
         U_SK: 'USER#test',
         studentId: 'test',
         firstName: 'Joe',
         lastName: 'Baker',
         courseId: 'course123',
         courseName: 'Test Course',
         points: 0,
         totalPointsAwarded: 0,
         totalPointsSpent: 0
      }
      expect(studentInputToDBItem(input, 'Test Course')).toEqual(expectedRes);
   });
});

