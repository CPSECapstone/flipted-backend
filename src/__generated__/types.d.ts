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
  missionContent?: Maybe<Array<Maybe<MissionContent>>>;
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
  addFrQuestion: Scalars['String'];
  addImageBlock: Scalars['String'];
  addMcQuestion: Scalars['String'];
  addMission: Scalars['String'];
  addObjective: Scalars['String'];
  addProgress: Scalars['String'];
  addQuizBlock: Scalars['String'];
  addSubMission: Scalars['String'];
  addTarget: Scalars['String'];
  addTask: Scalars['String'];
  addTextBlock: Scalars['String'];
  addVideoBlock: Scalars['String'];
  editOrCreateGoal: Scalars['String'];
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
};


type MutationAddCourseArgs = {
  course: CourseInput;
};


type MutationAddFrQuestionArgs = {
  question: FrQuestionInput;
};


type MutationAddImageBlockArgs = {
  imageblock: ImageBlockInput;
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


type MutationEditOrCreateGoalArgs = {
  goal: GoalInput;
};


type MutationSaveFreeResponseProgressArgs = {
  frBlockInput?: Maybe<FreeResponseAnswerInput>;
};


type MutationSaveMultipleChoiceProgressArgs = {
  mcBlockInput?: Maybe<MultipleChoiceAnswerInput>;
};


type MutationSubmitTaskArgs = {
  taskId?: Maybe<Scalars['String']>;
};


type MutationSubmitTaskProgressArgs = {
  taskProgress?: Maybe<TaskProgressInput>;
};


type MutationUpdateUserArgs = {
  updateUserInput?: Maybe<UpdateUserInput>;
};

type Objective = {
  __typename?: 'Objective';
  objectiveId: Scalars['String'];
  objectiveName: Scalars['String'];
  description: Scalars['String'];
  targetId: Scalars['String'];
  targetName: Scalars['String'];
  course: Scalars['String'];
  taskIds: Array<Scalars['String']>;
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
  courseContent: CourseContent;
  courseInfo: CourseInfo;
  courseInfos: Array<CourseInfo>;
  getAllGoals: Array<Goal>;
  getAllMissionProgress?: Maybe<MissionProgress>;
  /** Instructor only: get a user's goal given the user and the goal id */
  getGoalById: Goal;
  getUser?: Maybe<User>;
  mission?: Maybe<Mission>;
  missions?: Maybe<Array<Maybe<Mission>>>;
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
  subMission?: Maybe<SubMission>;
  target: Target;
  targets: Array<Target>;
  task: Task;
  taskInfo: Task;
  tasks: Array<Task>;
  tasksByCourse: Array<Task>;
  userProgress: UserProgress;
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


type QueryGetAllMissionProgressArgs = {
  courseId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};


type QueryGetGoalByIdArgs = {
  id: Scalars['String'];
  user: Scalars['String'];
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
  taskId?: Maybe<Scalars['String']>;
};


type QueryRetrieveTaskProgressArgs = {
  taskId?: Maybe<Scalars['String']>;
};


type QueryRetrieveTaskSubmissionArgs = {
  taskId?: Maybe<Scalars['String']>;
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
  /** Null indicates that this task does not yet have an associated submission */
  submission?: Maybe<TaskSubmissionResult>;
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
