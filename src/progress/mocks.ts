const mockMission: Mission = {
   id: "MISSION#123",
   course: "My Awesome Backend Mock Course",
   name: "Backend-Mocked Mission",
   description: "This is a mock mission."
};

const mockTaskStats: TaskStats[] = [
   {
      taskId: "TASK#1",
      name: "Mock task 1",
      submission: { graded: true, pointsAwarded: 93, pointsPossible: 100 }
   },
   {
      taskId: "TASK#2",
      name: "Mock Task 2",
      submission: { graded: true, pointsAwarded: 14, pointsPossible: 25 }
   },
   {
      taskId: "TASK#2",
      name: "Mock Task 3: Submitted yet not graded",
      submission: { graded: false }
   },
   {
      taskId: "TASK#2",
      name: "Mock Task 4: No Submission"
   }
];

export const mockMissionProgress: MissionProgress[] = [
   {
      mission: mockMission,
      progress: mockTaskStats,
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
         },
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
