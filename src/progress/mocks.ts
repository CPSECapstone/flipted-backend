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
      name: "Mock Task 4: No Submission",
   } 
];

export const mockMissionProgress: MissionProgress[] = [{
   mission: mockMission,
   progress: mockTaskStats,
   student: "MOCKUSER_123"
}];
