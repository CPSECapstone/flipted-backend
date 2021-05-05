import { uid } from "uid/secure";
import { GoalItem } from "../../src/interfaces/goal";
import { RoleInternal } from "../../src/interfaces/role";
import { convertGoalInputToItem, dbGoalItemToGoal } from "../../src/services/goalLogic";
const date: Date = new Date(0);
const dateString: string = date.toISOString()
describe("Converting goal inputs to goal db items", () => {
   it("Will convert a completely new goal input from a student to a GoalItem", async () => {
      const username: string = "GOOGLE#123456";

      const goalInput: GoalInput = {
         id: "123",
         title: "Eat ice cream",
         dueDate: date,
         completed: false,
         category: "Emotional",
         favorited: false,
         subGoals: [
            { title: "MINT CHOCOLATE!", dueDate: date, completed: false },
            { title: "VANILLA!", dueDate: date, completed: true, completedDate: date }
         ],
         pointValue: 123, // should ignore this 
         owner: "I AM THE GREATEST!", // should ignore this
         assignee: "MY_ENEMIES_USERNAME" // should ignore this
      };

      const expectedOutput: GoalItem = {
         PK: "GOAL#" + "GOOGLE#123456",
         SK: "GOAL#" + "123",
         id: "123",
         title: "Eat ice cream",
         dueDate: dateString,
         completed: false,
         subGoals: [
            { title: "MINT CHOCOLATE!", dueDate: dateString, completed: false },
            { title: "VANILLA!", dueDate: dateString, completed: true, completedDate: dateString }
         ],
         category: "Emotional",
         favorited: false,
         owner: "GOOGLE#123456",
         assignee: "GOOGLE#123456",
         pointValue: 0
      };

      expect(convertGoalInputToItem(goalInput, RoleInternal.Student, username)).toEqual(
         expectedOutput
      );
   });

   it("Will convert a goal input from a teacher to a GoalItem", async () => {
      const teacherUsername: string = "TEACHER#123456";
      const studentUsername: string = "GOOGLE#123456";

      const goalInput: GoalInput = {
         id: "123",
         title: "Eat ice cream",
         dueDate: date,
         completed: true,
         completedDate: new Date(0),
         category: "Emotional",
         favorited: false,
         subGoals: [
            { title: "MINT CHOCOLATE!", dueDate: date, completed: false },
            { title: "VANILLA!", dueDate: date, completed: true, completedDate: date }
         ],
         pointValue: 123, // should not ignore this 
         assignee: studentUsername, // should not  ignore this
         owner: teacherUsername
      };

      const expectedOutput: GoalItem = {
         PK: "GOAL#" + studentUsername,
         SK: "GOAL#" + "123",
         id: "123",
         title: "Eat ice cream",
         dueDate: dateString,
         completed: true,
         completedDate: dateString,
         subGoals: [
            { title: "MINT CHOCOLATE!", dueDate: dateString, completed: false },
            { title: "VANILLA!", dueDate: dateString, completed: true, completedDate: dateString }
         ],
         category: "Emotional",
         favorited: false,
         pointValue: 123, 
         assignee: studentUsername, 
         owner: teacherUsername
      };

      expect(convertGoalInputToItem(goalInput, RoleInternal.Instructor, studentUsername)).toEqual(
         expectedOutput
      );
   });
});

describe("Converting goal db items to goals", () => {
   it("Will convert a goal db item to a goal", async () => {
      const username: string = "GOOGLE#123456";

      const item: GoalItem = {
         PK: "GOAL#" + username,
         SK: "GOAL#" + "123",
         id: "123",
         title: "Eat ice cream",
         dueDate: dateString,
         completed: false,
         subGoals: [
            { title: "MINT CHOCOLATE!", dueDate: dateString, completed: false },
            { title: "VANILLA!", dueDate: dateString, completed: true, completedDate: dateString }
         ],
         category: "Emotional",
         favorited: false,
         owner: username,
         assignee: username,
         pointValue: 0
      };

      const expectedOutput: Goal = {
         id: "123",
         title: "Eat ice cream",
         dueDate: date,
         completed: false,
         category: "Emotional",
         favorited: false,
         subGoals: [
            { title: "MINT CHOCOLATE!", dueDate: date, completed: false },
            { title: "VANILLA!", dueDate: date, completed: true, completedDate: date }
         ],
         pointValue: 0, // should not ignore this 
         assignee: "GOOGLE#123456", // should not  ignore this
         owner: "GOOGLE#123456"
      };

      expect(dbGoalItemToGoal(item)).toEqual(
         expectedOutput
      );
   });

});

