type Maybe<T> = T | null | undefined;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

type Answer = {
  __typename?: 'Answer';
  questionId?: Maybe<Scalars['String']>;
  pointsAwarded?: Maybe<Scalars['Int']>;
  /** Either the id of the chosen answer id or the provided free response */
  answer?: Maybe<Scalars['String']>;
  graded: Scalars['Boolean'];
  teacherComment?: Maybe<Scalars['String']>;
};

type AnswerGrade = {
  __typename?: 'AnswerGrade';
  student: Scalars['String'];
  questionId: Scalars['String'];
  pointsAwarded: Scalars['Int'];
  teacherComment?: Maybe<Scalars['String']>;
};

type AnswerGradeInput = {
  student: Scalars['String'];
  questionId: Scalars['String'];
  pointsAwarded: Scalars['Int'];
  teacherComment?: Maybe<Scalars['String']>;
};

type ClassMissionMastery = {
  __typename?: 'ClassMissionMastery';
  mission: Mission;
  studentMissionMasteryList: Array<StudentMissionMastery>;
};

type ClassTargetMastery = {
  __typename?: 'ClassTargetMastery';
  target: Target;
  studentObjectiveMasteryList: Array<StudentObjectiveMastery>;
};

type CourseContent = {
  __typename?: 'CourseContent';
  courseInfo: CourseInfo;
  missions: Array<Mission>;
  targets: Array<Target>;
};

type CourseInfo = {
  __typename?: 'CourseInfo';
  courseId: Scalars['String'];
  course: Scalars['String'];
  instructor: Scalars['String'];
  description: Scalars['String'];
};

type CourseInput = {
  course: Scalars['String'];
  instructor: Scalars['String'];
  description: Scalars['String'];
};


type FrBlock = TaskBlock & {
  __typename?: 'FrBlock';
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
  points: Scalars['Int'];
  stem: Scalars['String'];
  answer?: Maybe<Scalars['String']>;
};

type FrBlockInput = {
  taskId: Scalars['String'];
  title: Scalars['String'];
  pageIndex: Scalars['Int'];
  blockIndex: Scalars['Int'];
  points: Scalars['Int'];
  stem: Scalars['String'];
  answer?: Maybe<Scalars['String']>;
};

type FrQuestion = Question & {
  __typename?: 'FrQuestion';
  id: Scalars['String'];
  description: Scalars['String'];
  points: Scalars['Int'];
  answer?: Maybe<Scalars['String']>;
  feedback?: Maybe<Scalars['String']>;
};

type FrQuestionInput = {
  description: Scalars['String'];
  points: Scalars['Int'];
  answer: Scalars['String'];
};

/** Represents a students answer to a free response question */
type FreeResponseAnswerInput = {
  /** The id of the task the question block is contained in */
  taskId: Scalars['String'];
  /** the id of the quiz block the question is contained in */
  questionBlockId: Scalars['String'];
  /** The id of the question block the student is answering */
  questionId: Scalars['String'];
  /** The string response provided by the student */
  answer: Scalars['String'];
};

type Goal = {
  __typename?: 'Goal';
  id: Scalars['String'];
  title: Scalars['String'];
  dueDate: Scalars['Date'];
  completed: Scalars['Boolean'];
  completedDate?: Maybe<Scalars['Date']>;
  subGoals: Array<SubGoal>;
  category: Scalars['String'];
  favorited: Scalars['Boolean'];
  owner: Scalars['String'];
  assignee: Scalars['String'];
  pointValue?: Maybe<Scalars['Int']>;
};

type GoalInput = {
  id?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  dueDate: Scalars['Date'];
  completed: Scalars['Boolean'];
  completedDate?: Maybe<Scalars['Date']>;
  subGoals: Array<SubGoalInput>;
  category: Scalars['String'];
  favorited: Scalars['Boolean'];
  owner?: Maybe<Scalars['String']>;
  assignee?: Maybe<Scalars['String']>;
  pointValue?: Maybe<Scalars['Int']>;
};

type ImageBlock = TaskBlock & {
  __typename?: 'ImageBlock';
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
  imageUrl: Scalars['String'];
};

type ImageBlockInput = {
  taskId: Scalars['String'];
  title: Scalars['String'];
  pageIndex: Scalars['Int'];
  blockIndex: Scalars['Int'];
  imageUrl: Scalars['String'];
};

type MarketListing = {
  __typename?: 'MarketListing';
  id: Scalars['String'];
  listingName: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  course: Scalars['String'];
  listedDate: Scalars['Date'];
  price: Scalars['Int'];
  stock?: Maybe<Scalars['Int']>;
  timesPurchased: Scalars['Int'];
};

type MarketListingInput = {
  listingName: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  price: Scalars['Int'];
  stock?: Maybe<Scalars['Int']>;
};

enum Mastery {
  NotGraded = 'NOT_GRADED',
  NotMastered = 'NOT_MASTERED',
  NearlyMastered = 'NEARLY_MASTERED',
  Mastered = 'MASTERED'
}

type McBlock = TaskBlock & {
  __typename?: 'McBlock';
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
  points: Scalars['Int'];
  stem: Scalars['String'];
  options: Array<Scalars['String']>;
  answers?: Maybe<Array<Scalars['Int']>>;
};

type McBlockInput = {
  taskId: Scalars['String'];
  title: Scalars['String'];
  pageIndex: Scalars['Int'];
  blockIndex: Scalars['Int'];
  points: Scalars['Int'];
  stem: Scalars['String'];
  options: Array<Scalars['String']>;
  answers?: Maybe<Array<Scalars['Int']>>;
};

type McQuestion = Question & {
  __typename?: 'McQuestion';
  id: Scalars['String'];
  description: Scalars['String'];
  points: Scalars['Int'];
  options: Array<QuestionOption>;
  answers: Array<Scalars['Int']>;
  feedback?: Maybe<Scalars['String']>;
};

type McQuestionInput = {
  description: Scalars['String'];
  points: Scalars['Int'];
  options: Array<Scalars['String']>;
  answers: Array<Scalars['Int']>;
};

type Mission = {
  __typename?: 'Mission';
  id: Scalars['String'];
  course: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  missionContent: Array<MissionContent>;
};

type MissionContent = Task | SubMission;

type MissionInput = {
  course: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
};

type MissionProgress = {
  __typename?: 'MissionProgress';
  mission: Mission;
  progress: Array<TaskStats>;
  student: Scalars['String'];
};

/** Represents a students answer to a multiple choice question */
type MultipleChoiceAnswerInput = {
  /** The id of the task the quiz block is contained in */
  taskId: Scalars['String'];
  /** the id of the quiz block the question is contained in */
  questionBlockId: Scalars['String'];
  /** The id of the question the student is answering */
  questionId: Scalars['String'];
  /** The id of the question option chosen by the student */
  answerId: Scalars['Int'];
};

type Mutation = {
  __typename?: 'Mutation';
  addCourse: Scalars['String'];
  addFrBlock: Scalars['String'];
  addFrQuestion: Scalars['String'];
  addImageBlock: Scalars['String'];
  addMarketListing: MarketListing;
  addMcBlock: Scalars['String'];
  addMcQuestion: Scalars['String'];
  addMission: Scalars['String'];
  addObjective: Scalars['String'];
  addProgress: Scalars['String'];
  addQuizBlock: Scalars['String'];
  addStudent: Scalars['String'];
  addSubMission: Scalars['String'];
  addTarget: Scalars['String'];
  addTask: Scalars['String'];
  addTextBlock: Scalars['String'];
  addVideoBlock: Scalars['String'];
  changePoints: Scalars['Int'];
  deleteGoal: Scalars['String'];
  editMarketListing: MarketListing;
  editOrCreateGoal: Scalars['String'];
  fulfillPurchase: Receipt;
  gradeAnswer: AnswerGrade;
  gradeObjectiveTaskMastery: ObjectiveTaskMastery;
  gradeTaskSubmission: TaskSubmissionGrade;
  purchase: Receipt;
  removeMarketListing: Scalars['String'];
  /** Saves and a students answer to a free response question quiz block */
  saveFreeResponseProgress: Scalars['Boolean'];
  /** Saves a students answer to a multiple choice question quiz block */
  saveMultipleChoiceProgress: Scalars['Boolean'];
  /**
   * Should be called when a student has completed all rubric requirements and answered
   * all questions in the task. If the above requirements are not satisfied, this will return
   * an error. Tells the system that the task is ready for grading.
   *
   * Even on a successful submission, many fields may be null
   * as a Task may require manual grading by an instructor.
   */
  submitTask: TaskSubmissionResult;
  /**
   * Saves completed rubric requirements linked to this task for the user
   * calling this function
   */
  submitTaskProgress: Scalars['String'];
  updateUser?: Maybe<UpdateUserOutput>;
  wipeAllProgress: Scalars['String'];
};


type MutationAddCourseArgs = {
  course: CourseInput;
};


type MutationAddFrBlockArgs = {
  frBlock: FrBlockInput;
};


type MutationAddFrQuestionArgs = {
  question: FrQuestionInput;
};


type MutationAddImageBlockArgs = {
  imageblock: ImageBlockInput;
};


type MutationAddMarketListingArgs = {
  course: Scalars['String'];
  listing: MarketListingInput;
};


type MutationAddMcBlockArgs = {
  mcBlock: McBlockInput;
};


type MutationAddMcQuestionArgs = {
  question: McQuestionInput;
};


type MutationAddMissionArgs = {
  mission: MissionInput;
};


type MutationAddObjectiveArgs = {
  objective: ObjectiveInput;
};


type MutationAddProgressArgs = {
  progress: ProgressInput;
};


type MutationAddQuizBlockArgs = {
  quizblock: QuizBlockInput;
};


type MutationAddStudentArgs = {
  student: StudentInput;
};


type MutationAddSubMissionArgs = {
  subMission: SubMissionInput;
};


type MutationAddTargetArgs = {
  target: TargetInput;
};


type MutationAddTaskArgs = {
  task: TaskInput;
};


type MutationAddTextBlockArgs = {
  textblock: TextBlockInput;
};


type MutationAddVideoBlockArgs = {
  videoblock: VideoBlockInput;
};


type MutationChangePointsArgs = {
  course: Scalars['String'];
  student: Scalars['String'];
  points: Scalars['Int'];
};


type MutationDeleteGoalArgs = {
  id: Scalars['String'];
};


type MutationEditMarketListingArgs = {
  course: Scalars['String'];
  id: Scalars['String'];
  listing: MarketListingInput;
};


type MutationEditOrCreateGoalArgs = {
  goal: GoalInput;
};


type MutationFulfillPurchaseArgs = {
  course: Scalars['String'];
  receiptId: Scalars['String'];
  fulfilled: Scalars['Boolean'];
};


type MutationGradeAnswerArgs = {
  grade: AnswerGradeInput;
};


type MutationGradeObjectiveTaskMasteryArgs = {
  grade: ObjectiveTaskMasteryInput;
};


type MutationGradeTaskSubmissionArgs = {
  grade: TaskSubmissionGradeInput;
};


type MutationPurchaseArgs = {
  course: Scalars['String'];
  listingId: Scalars['String'];
  quantity: Scalars['Int'];
  note: Scalars['String'];
};


type MutationRemoveMarketListingArgs = {
  course: Scalars['String'];
  id: Scalars['String'];
};


type MutationSaveFreeResponseProgressArgs = {
  frBlockInput: FreeResponseAnswerInput;
};


type MutationSaveMultipleChoiceProgressArgs = {
  mcBlockInput: MultipleChoiceAnswerInput;
};


type MutationSubmitTaskArgs = {
  taskId: Scalars['String'];
};


type MutationSubmitTaskProgressArgs = {
  taskProgress: TaskProgressInput;
};


type MutationUpdateUserArgs = {
  updateUserInput?: Maybe<UpdateUserInput>;
};


type MutationWipeAllProgressArgs = {
  username: Scalars['String'];
};

type Objective = {
  __typename?: 'Objective';
  objectiveId: Scalars['String'];
  objectiveName: Scalars['String'];
  description: Scalars['String'];
  targetId: Scalars['String'];
  targetName: Scalars['String'];
  course: Scalars['String'];
  tasks: Array<Task>;
};

type ObjectiveInput = {
  objectiveName: Scalars['String'];
  description: Scalars['String'];
  targetId: Scalars['String'];
  targetName: Scalars['String'];
  course: Scalars['String'];
  taskIds: Array<Scalars['String']>;
};

type ObjectiveMastery = {
  __typename?: 'ObjectiveMastery';
  objectiveId: Scalars['String'];
  targetId: Scalars['String'];
  mastery: Scalars['String'];
};

type ObjectiveProgress = {
  __typename?: 'ObjectiveProgress';
  objectiveId: Scalars['String'];
  objectiveName: Scalars['String'];
  tasks: Array<TaskObjectiveProgress>;
};

type ObjectiveTaskMastery = {
  __typename?: 'ObjectiveTaskMastery';
  student: Scalars['String'];
  taskId: Scalars['String'];
  objectiveId: Scalars['String'];
  mastery: Mastery;
};

type ObjectiveTaskMasteryInput = {
  student: Scalars['String'];
  taskId: Scalars['String'];
  objectiveId: Scalars['String'];
  mastery: Mastery;
};

type Page = {
  __typename?: 'Page';
  blocks: Array<TaskBlock>;
  skippable?: Maybe<Scalars['Boolean']>;
};

type PageInput = {
  skippable?: Maybe<Scalars['Boolean']>;
};

type Progress = {
  __typename?: 'Progress';
  taskId: Scalars['String'];
  status: Scalars['Boolean'];
};

type ProgressInput = {
  userName: Scalars['String'];
  course: Scalars['String'];
  taskId: Scalars['String'];
  status: Scalars['Boolean'];
};

type ProgressOverview = {
  __typename?: 'ProgressOverview';
  userProgress: Array<UserProgress>;
  courseInfo: CourseInfo;
  missions: Array<Mission>;
  targets: Array<Target>;
};

type ProgresssDeletionInput = {
  userName: Scalars['String'];
  course: Scalars['String'];
  taskId: Scalars['String'];
};

type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  classMissionMastery: ClassMissionMastery;
  classTargetMastery: ClassTargetMastery;
  courseContent: CourseContent;
  courseInfo: CourseInfo;
  courseInfos: Array<CourseInfo>;
  getAllEnrolledStudentMissionProgress: Array<MissionProgress>;
  getAllGoals: Array<Goal>;
  getAllMissionProgress: Array<MissionProgress>;
  getAllTargetProgress: Array<TargetProgress>;
  /** Instructor only: get a user's goal given the user and the goal id */
  getGoalById: Goal;
  getMissionProgress: MissionProgress;
  getTaskObjectiveProgress: Array<TaskObjectiveProgress>;
  getUser?: Maybe<User>;
  marketListings: Array<MarketListing>;
  mission: Mission;
  missions: Array<Mission>;
  objective: Objective;
  objectives: Array<Objective>;
  progressByCourse: Array<UserProgress>;
  progressOverview: ProgressOverview;
  questions: Array<Question>;
  quizblock: QuizBlock;
  /** Returns student's task progress on the rubric requirements if it exists. */
  retrieveQuestionProgress: QuestionProgress;
  /** Returns student's progress on the rubric requirements for the task if it exists. */
  retrieveTaskProgress?: Maybe<TaskProgress>;
  /**
   * Returns an existing task submission or errors if it does not exist.
   * May be useful as a TaskSubmissionResult can change as a result of instructor actions.
   */
  retrieveTaskSubmission?: Maybe<TaskSubmissionResult>;
  student: Student;
  students: Array<Student>;
  subMission?: Maybe<SubMission>;
  target: Target;
  targets: Array<Target>;
  task: Task;
  taskInfo: Task;
  taskSubmissionSummary: TaskSubmissionSummary;
  tasks: Array<Task>;
  tasksByCourse: Array<Task>;
  userProgress: UserProgress;
};


type QueryClassMissionMasteryArgs = {
  missionId: Scalars['String'];
};


type QueryClassTargetMasteryArgs = {
  targetId: Scalars['String'];
};


type QueryCourseContentArgs = {
  course: Scalars['String'];
};


type QueryCourseInfoArgs = {
  courseId: Scalars['String'];
};


type QueryCourseInfosArgs = {
  instructor: Scalars['String'];
};


type QueryGetAllEnrolledStudentMissionProgressArgs = {
  courseId: Scalars['String'];
  missionId: Scalars['String'];
};


type QueryGetAllMissionProgressArgs = {
  courseId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};


type QueryGetAllTargetProgressArgs = {
  courseId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};


type QueryGetGoalByIdArgs = {
  id: Scalars['String'];
  user: Scalars['String'];
};


type QueryGetMissionProgressArgs = {
  missionId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};


type QueryGetTaskObjectiveProgressArgs = {
  taskId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};


type QueryMarketListingsArgs = {
  course: Scalars['String'];
};


type QueryMissionArgs = {
  missionId?: Maybe<Scalars['String']>;
};


type QueryMissionsArgs = {
  course?: Maybe<Scalars['String']>;
};


type QueryObjectiveArgs = {
  objectiveId: Scalars['String'];
};


type QueryObjectivesArgs = {
  course: Scalars['String'];
};


type QueryProgressByCourseArgs = {
  course: Scalars['String'];
};


type QueryProgressOverviewArgs = {
  course: Scalars['String'];
};


type QueryQuestionsArgs = {
  questionIds: Array<Scalars['String']>;
};


type QueryQuizblockArgs = {
  taskId: Scalars['String'];
  blockId: Scalars['String'];
};


type QueryRetrieveQuestionProgressArgs = {
  taskId: Scalars['String'];
};


type QueryRetrieveTaskProgressArgs = {
  taskId: Scalars['String'];
};


type QueryRetrieveTaskSubmissionArgs = {
  taskId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};


type QueryStudentArgs = {
  studentId?: Maybe<Scalars['String']>;
  course: Scalars['String'];
};


type QueryStudentsArgs = {
  course: Scalars['String'];
};


type QuerySubMissionArgs = {
  subMissionId?: Maybe<Scalars['String']>;
};


type QueryTargetArgs = {
  targetId: Scalars['String'];
};


type QueryTargetsArgs = {
  course: Scalars['String'];
};


type QueryTaskArgs = {
  taskId?: Maybe<Scalars['String']>;
};


type QueryTaskInfoArgs = {
  taskId: Scalars['String'];
};


type QueryTaskSubmissionSummaryArgs = {
  course: Scalars['String'];
  taskId: Scalars['String'];
};


type QueryTasksArgs = {
  subMissionId?: Maybe<Scalars['String']>;
};


type QueryTasksByCourseArgs = {
  course: Scalars['String'];
};


type QueryUserProgressArgs = {
  userName: Scalars['String'];
  course: Scalars['String'];
};

interface Question {
  id: Scalars['String'];
  description: Scalars['String'];
  points: Scalars['Int'];
  feedback?: Maybe<Scalars['String']>;
}

/** An answer to a question that has been graded either automatically or by the teacher */
type QuestionAndAnswer = {
  __typename?: 'QuestionAndAnswer';
  /** The question, including its contents and point value */
  question: Question;
  /** The students answer to the question, including how many points were awarded. */
  answer?: Maybe<Answer>;
};

type QuestionOption = {
  __typename?: 'QuestionOption';
  id: Scalars['Int'];
  description: Scalars['String'];
};

type QuestionProgress = {
  __typename?: 'QuestionProgress';
  /** The id of the task the user submitted progress towards. */
  taskId: Scalars['String'];
  /** Each recorded answer to the questions contained in the task. The points awarded will be null. */
  answers: Array<Answer>;
};

type QuizBlock = TaskBlock & {
  __typename?: 'QuizBlock';
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
  requiredScore: Scalars['Int'];
  points: Scalars['Int'];
  questions: Array<Question>;
};

type QuizBlockInput = {
  taskId: Scalars['String'];
  title: Scalars['String'];
  pageIndex: Scalars['Int'];
  blockIndex: Scalars['Int'];
  requiredScore: Scalars['Int'];
  points: Scalars['Int'];
  questionIds: Array<Scalars['String']>;
};

/**
 * The student and listing objects contained in the receipt will reflect
 * the updated values as a result of the purchase.
 */
type Receipt = {
  __typename?: 'Receipt';
  studentId: Scalars['String'];
  listingName: Scalars['String'];
  listingId: Scalars['String'];
  student: Student;
  listing: MarketListing;
  receiptId: Scalars['String'];
  course: Scalars['String'];
  note: Scalars['String'];
  purchaseDate: Scalars['Date'];
  pointsSpent: Scalars['Int'];
  quantity: Scalars['Int'];
  fulfilled: Scalars['Boolean'];
};

enum Role {
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR'
}

type RubricRequirement = {
  __typename?: 'RubricRequirement';
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  isComplete: Scalars['Boolean'];
};

type RubricRequirementInput = {
  description?: Maybe<Scalars['String']>;
};

type Student = {
  __typename?: 'Student';
  studentId: Scalars['String'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  course: Scalars['String'];
  section: Scalars['Int'];
  team?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
  totalPointsAwarded: Scalars['Int'];
  totalPointsSpent: Scalars['Int'];
};

type StudentInput = {
  studentId: Scalars['String'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  course: Scalars['String'];
  section: Scalars['Int'];
  team?: Maybe<Scalars['String']>;
};

type StudentMissionMastery = {
  __typename?: 'StudentMissionMastery';
  student: Student;
  currentTaskId: Scalars['String'];
  currentTaskName: Scalars['String'];
  level: Scalars['Int'];
  progress: Scalars['Float'];
};

type StudentMissionMasteryInput = {
  missionId: Scalars['String'];
  studentId: Scalars['String'];
  currentTaskId: Scalars['String'];
  level: Scalars['Int'];
  progress: Scalars['Float'];
};

type StudentObjectiveMastery = {
  __typename?: 'StudentObjectiveMastery';
  student: Student;
  objectiveMasteryList: Array<ObjectiveMastery>;
};

type StudentObjectiveMasteryInput = {
  studentId: Scalars['String'];
  objectiveId: Scalars['String'];
  targetId: Scalars['String'];
  mastery: Scalars['String'];
};

type StudentTaskSubmissionResult = {
  __typename?: 'StudentTaskSubmissionResult';
  studentName: Scalars['String'];
  studentId: Scalars['String'];
  /**
   * Todo
   * The pointsAwarded is calculated on fly when a single task submission is queried. Here we are querying a list of task submission, the pointsAwarded would not be accurate since we are not recalcuated it.
   */
  pointsAwarded?: Maybe<Scalars['Int']>;
  graded: Scalars['Boolean'];
  teacherComment?: Maybe<Scalars['String']>;
  submitted: Scalars['Boolean'];
};

type SubGoal = {
  __typename?: 'SubGoal';
  title: Scalars['String'];
  dueDate: Scalars['Date'];
  completed: Scalars['Boolean'];
  completedDate?: Maybe<Scalars['Date']>;
};

type SubGoalInput = {
  title: Scalars['String'];
  dueDate: Scalars['Date'];
  completed: Scalars['Boolean'];
  completedDate?: Maybe<Scalars['Date']>;
};

type SubMission = {
  __typename?: 'SubMission';
  id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  missionId: Scalars['String'];
  missionIndex: Scalars['Int'];
  objectiveId?: Maybe<Scalars['String']>;
  missionContent?: Maybe<Array<Maybe<MissionContent>>>;
};

type SubMissionInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  missionId: Scalars['String'];
  missionIndex: Scalars['Int'];
};

type Target = {
  __typename?: 'Target';
  targetId: Scalars['String'];
  targetName: Scalars['String'];
  description: Scalars['String'];
  subject: Scalars['String'];
  gradeLevel: Scalars['Int'];
  icon: Scalars['String'];
  standards: Scalars['String'];
  course: Scalars['String'];
  objectives: Array<Objective>;
};

type TargetInput = {
  targetName: Scalars['String'];
  description: Scalars['String'];
  subject: Scalars['String'];
  gradeLevel: Scalars['Int'];
  icon: Scalars['String'];
  standards: Scalars['String'];
  course: Scalars['String'];
};

type TargetProgress = {
  __typename?: 'TargetProgress';
  target: Target;
  objectives: Array<ObjectiveProgress>;
  student: Scalars['String'];
};

type Task = {
  __typename?: 'Task';
  id: Scalars['String'];
  name: Scalars['String'];
  instructions: Scalars['String'];
  points: Scalars['Int'];
  startAt?: Maybe<Scalars['Date']>;
  endAt?: Maybe<Scalars['Date']>;
  dueDate?: Maybe<Scalars['Date']>;
  pages: Array<Page>;
  requirements: Array<RubricRequirement>;
  course: Scalars['String'];
  missionId: Scalars['String'];
  missionIndex: Scalars['Int'];
  subMissionId?: Maybe<Scalars['String']>;
  objectiveId?: Maybe<Scalars['String']>;
  targetId?: Maybe<Scalars['String']>;
};

interface TaskBlock {
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
}

type TaskInput = {
  name: Scalars['String'];
  instructions: Scalars['String'];
  points: Scalars['Int'];
  startAt?: Maybe<Scalars['Date']>;
  endAt?: Maybe<Scalars['Date']>;
  dueDate?: Maybe<Scalars['Date']>;
  pages: Array<Maybe<PageInput>>;
  requirements: Array<RubricRequirementInput>;
  course: Scalars['String'];
  missionId: Scalars['String'];
  missionIndex: Scalars['Int'];
  subMissionId?: Maybe<Scalars['String']>;
  objectiveId?: Maybe<Scalars['String']>;
  targetId?: Maybe<Scalars['String']>;
};

type TaskObjectiveProgress = {
  __typename?: 'TaskObjectiveProgress';
  task: Task;
  objective: Objective;
  mastery: Mastery;
};

type TaskProgress = {
  __typename?: 'TaskProgress';
  /** The id of the task the user submitted progress towards. */
  taskId: Scalars['String'];
  username: Scalars['String'];
  /** The ids of each requirement */
  finishedRequirementIds: Array<Scalars['String']>;
};

type TaskProgressInput = {
  /**
   * The id if each requirement contained within each
   * completed block
   */
  finishedRequirementIds: Array<Scalars['String']>;
  /** The id of the task the user is submitting progress towards. */
  taskId: Scalars['String'];
};

type TaskStats = {
  __typename?: 'TaskStats';
  taskId: Scalars['String'];
  name: Scalars['String'];
  username: Scalars['String'];
  /** Null indicates that this task does not yet have an associated submission */
  submission?: Maybe<TaskSubmissionResult>;
};

type TaskSubmissionGrade = {
  __typename?: 'TaskSubmissionGrade';
  taskId: Scalars['String'];
  student: Scalars['String'];
  teacherComment?: Maybe<Scalars['String']>;
  /**
   * This is only for the points that aren't directly associated to a question answer.
   * If this exceeds the total point worth of the task minus the points accounted for by questions,
   * it will give the student extra credit.
   */
  pointsAwarded: Scalars['Int'];
};

type TaskSubmissionGradeInput = {
  taskId: Scalars['String'];
  student: Scalars['String'];
  teacherComment?: Maybe<Scalars['String']>;
  /**
   * This is only for the points that aren't directly associated to a question answer.
   * If this exceeds the total point worth of the task minus the points accounted for by questions,
   * it will give the student extra credit.
   */
  pointsAwarded: Scalars['Int'];
};

/**
 * Created when all requirements for a task have been satisfied and a task has
 * been submitted. Many fields may be null pending grading by the teacher
 */
type TaskSubmissionResult = {
  __typename?: 'TaskSubmissionResult';
  /** Will be true when the teacher has finalized their grading on the task */
  graded: Scalars['Boolean'];
  /**
   * The current amount of points awarded for completing this task.
   * May be different before and after graded is set based on a combination of
   * automatic scoring and teacher grading
   */
  pointsAwarded?: Maybe<Scalars['Int']>;
  pointsPossible?: Maybe<Scalars['Int']>;
  /**
   * Information on the student result
   * for each question as well as the question itself
   */
  questionAndAnswers?: Maybe<Array<QuestionAndAnswer>>;
  teacherComment?: Maybe<Scalars['String']>;
  taskId: Scalars['String'];
};

type TaskSubmissionSummary = {
  __typename?: 'TaskSubmissionSummary';
  task: Task;
  results: Array<StudentTaskSubmissionResult>;
};

type TextBlock = TaskBlock & {
  __typename?: 'TextBlock';
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
  contents?: Maybe<Scalars['String']>;
  fontSize?: Maybe<Scalars['Int']>;
};

type TextBlockInput = {
  taskId: Scalars['String'];
  title: Scalars['String'];
  pageIndex: Scalars['Int'];
  blockIndex: Scalars['Int'];
  contents: Scalars['String'];
  fontSize: Scalars['Int'];
};

type UpdateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

type UpdateUserOutput = {
  __typename?: 'UpdateUserOutput';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

type User = {
  __typename?: 'User';
  id: Scalars['String'];
  role: Role;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

type UserProgress = {
  __typename?: 'UserProgress';
  userName: Scalars['String'];
  progress: Array<Progress>;
};

type VideoBlock = TaskBlock & {
  __typename?: 'VideoBlock';
  title: Scalars['String'];
  blockId: Scalars['String'];
  blockIndex: Scalars['Int'];
  pageIndex: Scalars['Int'];
  videoUrl: Scalars['String'];
};

type VideoBlockInput = {
  taskId: Scalars['String'];
  title: Scalars['String'];
  pageIndex: Scalars['Int'];
  blockIndex: Scalars['Int'];
  videoUrl: Scalars['String'];
};
