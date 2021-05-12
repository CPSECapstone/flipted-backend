import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";

export const mockTasks: Task[] = [
   {
      id: "TASK#1",
      name: "Mock Task 1",
      instructions: "",
      points: 100,
      pages: [],
      requirements: [],
      course: "My Awesome Backend Mock Course",
      missionId: "MISSION#123",
      missionIndex: 0
   },
   {
      id: "TASK#2",
      name: "Mock Task 2",
      instructions: "",
      points: 25,
      pages: [],
      requirements: [],
      course: "My Awesome Backend Mock Course",
      missionId: "MISSION#123",
      missionIndex: 1
   },
   {
      id: "TASK#3",
      name: "Mock Task 3: Submitted yet not graded",
      instructions: "",
      points: 10,
      pages: [],
      requirements: [],
      course: "My Awesome Backend Mock Course",
      missionId: "MISSION#123",
      missionIndex: 2
   },
   {
      id: "TASK#4",
      name: "Mock Task 4: No Submission",
      instructions: "",
      points: 10,
      pages: [],
      requirements: [],
      course: "My Awesome Backend Mock Course",
      missionId: "MISSION#123",
      missionIndex: 3
   },
   {
      id: "TASK#5",
      name: "Mock Task 5",
      instructions: "",
      points: 10,
      pages: [],
      requirements: [],
      course: "My Awesome Backend Mock Course",
      missionId: "MISSION#456",
      missionIndex: 0
   },
   {
      id: "TASK#6",
      name: "Mock Task 6",
      instructions: "",
      points: 10,
      pages: [],
      requirements: [],
      course: "My Awesome Backend Mock Course",
      missionId: "MISSION#456",
      missionIndex: 1
   }
];

export const mockMission_1: Mission = {
   id: "MISSION#123",
   course: "My Awesome Backend Mock Course",
   name: "Backend-Mocked Mission",
   description: "This is a mock mission."
};

export const mockMission_2: Mission = {
   id: "MISSION#456",
   course: "My Awesome Backend Mock Course",
   name: "Second Backend-Mocked Mission",
   description: "This is the second mock mission."
};

export const mockTaskSubmissionItems: TaskSubmissionResultItem[] = [
   {
      PK: "TASK_SUBMISSION#MOCKUSER_123", // #TASK_SUBMISSION + username
      SK: "TASK#1", // task id
      graded: true,
      pointsAwarded: 93,
      pointsPossible: 100,
      missionId: "MISSION#123",
      course: "My Awesome Backend Mock Course"
   },
   {
      PK: "TASK_SUBMISSION#MOCKUSER_123", // #TASK_SUBMISSION + username
      SK: "TASK#2", // task id
      graded: true,
      pointsAwarded: 14,
      pointsPossible: 25,
      missionId: "MISSION#123",
      course: "My Awesome Backend Mock Course"
   },
   {
      PK: "TASK_SUBMISSION#MOCKUSER_123", // #TASK_SUBMISSION + username
      SK: "TASK#3", // task id
      graded: false,
      missionId: "MISSION#123",
      course: "My Awesome Backend Mock Course",
   },
   {
      PK: "TASK_SUBMISSION#MOCKUSER_123", // #TASK_SUBMISSION + username
      SK: "TASK#5", // task id
      graded: true,
      missionId: "MISSION#456",
      course: "My Awesome Backend Mock Course",
      pointsAwarded: 8,
      pointsPossible: 10
   }
];

const mockTaskStats_1: TaskStats[] = [
   {
      taskId: "TASK#1",
      name: "Mock Task 1",
      submission: { graded: true, pointsAwarded: 93, pointsPossible: 100, taskId: "TASK#1"}
   },
   {
      taskId: "TASK#2",
      name: "Mock Task 2",
      submission: { graded: true, pointsAwarded: 14, pointsPossible: 25, taskId: "TASK#2" }
   },
   {
      taskId: "TASK#3",
      name: "Mock Task 3: Submitted yet not graded",
      submission: { graded: false, taskId: "TASK#3"}
   },
   {
      taskId: "TASK#4",
      name: "Mock Task 4: No Submission"
   }
];

const mockTaskStats_2: TaskStats[] = [
   {
      taskId: "TASK#5",
      name: "Mock Task 5",
      submission: { graded: true, pointsAwarded: 8, pointsPossible: 10, taskId: "TASK#5" }
   },
   {
      taskId: "TASK#6",
      name: "Mock Task 6"
   }
];

export const mockMissionProgress: MissionProgress[] = [
   {
      mission: mockMission_1,
      progress: mockTaskStats_1,
      student: "MOCKUSER_123"
   },
   {
      mission: mockMission_2,
      progress: mockTaskStats_2,
      student: "MOCKUSER_123"
   }
];

const mockTarget: Target = {
   targetId: "TARGET_123",
   targetName: "Backend-Mocked Target",
   description: "This is a mock target.",
   subject: "Mockery",
   gradeLevel: 1,
   icon: "",
   standards: "",
   course: "Mocking 101",
   objectives: []
};

const mockObjectiveProgress: ObjectiveProgress[] = [
   {
      objectiveId: "OBJECTIVE#123",
      objectiveName: "Backend-Mocked Objective 1",
      tasks: [
         {
            taskId: "TASK#123",
            taskName: "Task 1",
            mastery: "MASTERED" as Mastery
         },
         {
            taskId: "TASK#1234",
            taskName: "Task 2",
            mastery: "NEARLY_MASTERED" as Mastery
         },
         {
            taskId: "TASK#12345",
            taskName: "Task 3",
            mastery: "NOT_MASTERED" as Mastery
         },
         {
            taskId: "TASK#12345",
            taskName: "Task 3",
            mastery: "NOT_GRADED" as Mastery
         }
      ]
   },
   {
      objectiveId: "OBJECTIVE#1234",
      objectiveName: "Backend-Mocked Objective 2",
      tasks: [
         {
            taskId: "TASK#123",
            taskName: "Task A",
            mastery: "MASTERED" as Mastery
         },
         {
            taskId: "TASK#1234",
            taskName: "Task B",
            mastery: "MASTERED" as Mastery
         }
      ]
   }
];

export const mockTargetProgress: TargetProgress[] = [
   {
      target: mockTarget,
      objectives: mockObjectiveProgress,
      student: "MOCKUSER_123"
   }
];
