import { ObjectiveItem } from "../objective/objectiveInterface";
import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";
import { MasteryItem } from "./progressInterface";

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

export const mockObjectiveItems : ObjectiveItem[] = [
   {
      PK: "OBJECTIVE#1",
      SK: "OBJECTIVE#1",
      objectiveId: "OBJECTIVE#1",
      objectiveName: "Objective 1",
      description: "",
      targetId: "TARGET#1",
      targetName: "Target 1",
      course: "Mocking 101",
      taskIds: ["TASK#1", "TASK#2", "TASK#3"]
   },
   {
      PK: "OBJECTIVE#2",
      SK: "OBJECTIVE#2",
      objectiveId: "OBJECTIVE#2",
      objectiveName: "Objective 2",
      description: "",
      targetId: "TARGET#1",
      targetName: "Target 1",
      course: "Mocking 101",
      taskIds: ["TASK#1", "TASK#2", "TASK#4"]
   },
   {
      PK: "OBJECTIVE#3",
      SK: "OBJECTIVE#3",
      objectiveId: "OBJECTIVE#3",
      objectiveName: "Objective 3",
      description: "",
      targetId: "TARGET#2",
      targetName: "Target 2",
      course: "Mocking 101",
      taskIds: ["TASK#6"]
   },
   {
      PK: "OBJECTIVE#4",
      SK: "OBJECTIVE#4",
      objectiveId: "OBJECTIVE#4",
      objectiveName: "Objective 4",
      description: "",
      targetId: "TARGET#2",
      targetName: "Target 2",
      course: "Mocking 101",
      taskIds: ["TASK#5"]
   }
]

export const mockObjectives : Objective[] = [
   {
      objectiveId: "OBJECTIVE#1",
      objectiveName: "Objective 1",
      description: "",
      targetId: "TARGET#1",
      targetName: "Target 1",
      course: "Mocking 101",
      tasks: []
   },
   {
      objectiveId: "OBJECTIVE#2",
      objectiveName: "Objective 2",
      description: "",
      targetId: "TARGET#1",
      targetName: "Target 1",
      course: "Mocking 101",
      tasks: []
   },
   {
      objectiveId: "OBJECTIVE#3",
      objectiveName: "Objective 3",
      description: "",
      targetId: "TARGET#2",
      targetName: "Target 2",
      course: "Mocking 101",
      tasks: []
   },
   {
      objectiveId: "OBJECTIVE#4",
      objectiveName: "Objective 4",
      description: "",
      targetId: "TARGET#2",
      targetName: "Target 2",
      course: "Mocking 101",
      tasks: []
   }
]

export const mockMasteryItems: MasteryItem[] = [
   {
      PK: "TASK#1",
      SK: "OBJECTIVE#1",
      username: "USER_123",
      taskId: "TASK#1",
      objectiveId: "OBJECTIVE#1",
      course: "Mocking 101",
      mastery: "MASTERED"
   },
   {
      PK: "TASK#2",
      SK: "OBJECTIVE#1",
      username: "USER_123",
      taskId: "TASK#2",
      objectiveId: "OBJECTIVE#1",
      course: "Mocking 101",
      mastery: "NEARLY_MASTERED"
   },
   {
      PK: "TASK#3",
      SK: "OBJECTIVE#1",
      username: "USER_123",
      taskId: "TASK#3",
      objectiveId: "OBJECTIVE#1",
      course: "Mocking 101",
      mastery: "NOT_GRADED"
   },
   {
      PK: "TASK#1",
      SK: "OBJECTIVE#2",
      username: "USER_123",
      taskId: "TASK#1",
      objectiveId: "OBJECTIVE#2",
      course: "Mocking 101",
      mastery: "MASTERED"
   },
   {
      PK: "TASK#2",
      SK: "OBJECTIVE#2",
      username: "USER_123",
      taskId: "TASK#2",
      objectiveId: "OBJECTIVE#2",
      course: "Mocking 101",
      mastery: "NOT_MASTERED"
   },
   {
      PK: "TASK#4",
      SK: "OBJECTIVE#2",
      username: "USER_123",
      taskId: "TASK#4",
      objectiveId: "OBJECTIVE#2",
      course: "Mocking 101",
      mastery: "NOT_GRADED"
   },
   {
      PK: "TASK#5",
      SK: "OBJECTIVE#4",
      username: "USER_123",
      taskId: "TASK#5",
      objectiveId: "OBJECTIVE#4",
      course: "Mocking 101",
      mastery: "MASTERED"
   },
   
]

export const mockTarget_1: Target = {
   targetId: "TARGET#1",
   targetName: "Backend-Mocked Target",
   description: "This is a mock target.",
   subject: "Mockery",
   gradeLevel: 1,
   icon: "",
   standards: "",
   course: "Mocking 101",
   objectives: []
};

export const mockTarget_2: Target = {
   targetId: "TARGET#2",
   targetName: "Backend-Mocked Target 2",
   description: "This is the second mock target.",
   subject: "Mockery",
   gradeLevel: 1,
   icon: "",
   standards: "",
   course: "Mocking 101",
   objectives: []
};

const mockObjectiveProgress_T1 = [
   {
      objectiveId: "OBJECTIVE#1",
      objectiveName: "Objective 1",
      tasks: [
         {
            mastery: "MASTERED" as Mastery,
            objectiveId: "OBJECTIVE#1",
            taskId: "TASK#1"
         },
         {
            mastery: "NEARLY_MASTERED" as Mastery,
            objectiveId: "OBJECTIVE#1",
            taskId: "TASK#2"
         },
         {
            mastery: "NOT_GRADED" as Mastery,
            objectiveId: "OBJECTIVE#1",
            taskId: "TASK#3"
         },
      ]
   },
   {
      objectiveId: "OBJECTIVE#2",
      objectiveName: "Objective 2",
      tasks: [
         {
            mastery: "MASTERED" as Mastery,
            objectiveId: "OBJECTIVE#2",
            taskId: "TASK#1"
         },
         {
            mastery: "NOT_MASTERED" as Mastery,
            objectiveId: "OBJECTIVE#2",
            taskId: "TASK#2"
         },
         {
            mastery: "NOT_GRADED" as Mastery,
            objectiveId: "OBJECTIVE#2",
            taskId: "TASK#4"
         },
      ]
   }
];

const mockObjectiveProgress_T2 = [
   {
      objectiveId: "OBJECTIVE#3",
      objectiveName: "Objective 3",
      tasks: [
         {
            mastery: "NOT_GRADED" as Mastery,
            objectiveId: "OBJECTIVE#3",
            taskId: "TASK#6"
         }
      ]
   },
   {
      objectiveId: "OBJECTIVE#4",
      objectiveName: "Objective 4",
      tasks: [
         {
            mastery: "MASTERED" as Mastery,
            objectiveId: "OBJECTIVE#4",
            taskId: "TASK#5"
         }
      ]
   }
];

export const mockTargetProgress = [
   {
      target: mockTarget_1,
      objectives: mockObjectiveProgress_T1,
      student: "MOCKUSER_123"
   },
   {
      target: mockTarget_2,
      objectives: mockObjectiveProgress_T2,
      student: "MOCKUSER_123"
   }
];
