import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Answer: ResolverTypeWrapper<Answer>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  AnswerGrade: ResolverTypeWrapper<AnswerGrade>;
  AnswerGradeInput: AnswerGradeInput;
  ClassMissionMastery: ResolverTypeWrapper<ClassMissionMastery>;
  ClassTargetMastery: ResolverTypeWrapper<ClassTargetMastery>;
  CourseContent: ResolverTypeWrapper<CourseContent>;
  CourseInfo: ResolverTypeWrapper<CourseInfo>;
  CourseInput: CourseInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  FrBlock: ResolverTypeWrapper<FrBlock>;
  FrBlockInput: FrBlockInput;
  FrQuestion: ResolverTypeWrapper<FrQuestion>;
  FrQuestionInput: FrQuestionInput;
  FreeResponseAnswerInput: FreeResponseAnswerInput;
  Goal: ResolverTypeWrapper<Goal>;
  GoalInput: GoalInput;
  ImageBlock: ResolverTypeWrapper<ImageBlock>;
  ImageBlockInput: ImageBlockInput;
  MarketListing: ResolverTypeWrapper<MarketListing>;
  MarketListingInput: MarketListingInput;
  Mastery: Mastery;
  McBlock: ResolverTypeWrapper<McBlock>;
  McBlockInput: McBlockInput;
  McQuestion: ResolverTypeWrapper<McQuestion>;
  McQuestionInput: McQuestionInput;
  Mission: ResolverTypeWrapper<Omit<Mission, 'missionContent'> & { missionContent: Array<ResolversTypes['MissionContent']> }>;
  MissionContent: ResolversTypes['Task'] | ResolversTypes['SubMission'];
  MissionInput: MissionInput;
  MissionProgress: ResolverTypeWrapper<MissionProgress>;
  MultipleChoiceAnswerInput: MultipleChoiceAnswerInput;
  Mutation: ResolverTypeWrapper<{}>;
  Objective: ResolverTypeWrapper<Objective>;
  ObjectiveInput: ObjectiveInput;
  ObjectiveMastery: ResolverTypeWrapper<ObjectiveMastery>;
  ObjectiveProgress: ResolverTypeWrapper<ObjectiveProgress>;
  ObjectiveTaskMastery: ResolverTypeWrapper<ObjectiveTaskMastery>;
  ObjectiveTaskMasteryInput: ObjectiveTaskMasteryInput;
  Page: ResolverTypeWrapper<Page>;
  PageInput: PageInput;
  Progress: ResolverTypeWrapper<Progress>;
  ProgressInput: ProgressInput;
  ProgressOverview: ResolverTypeWrapper<ProgressOverview>;
  ProgresssDeletionInput: ProgresssDeletionInput;
  Query: ResolverTypeWrapper<{}>;
  Question: ResolversTypes['FrQuestion'] | ResolversTypes['McQuestion'];
  QuestionAndAnswer: ResolverTypeWrapper<QuestionAndAnswer>;
  QuestionOption: ResolverTypeWrapper<QuestionOption>;
  QuestionProgress: ResolverTypeWrapper<QuestionProgress>;
  QuizBlock: ResolverTypeWrapper<QuizBlock>;
  QuizBlockInput: QuizBlockInput;
  Receipt: ResolverTypeWrapper<Receipt>;
  Role: Role;
  RubricRequirement: ResolverTypeWrapper<RubricRequirement>;
  RubricRequirementInput: RubricRequirementInput;
  Student: ResolverTypeWrapper<Student>;
  StudentInput: StudentInput;
  StudentMissionMastery: ResolverTypeWrapper<StudentMissionMastery>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  StudentMissionMasteryInput: StudentMissionMasteryInput;
  StudentObjectiveMastery: ResolverTypeWrapper<StudentObjectiveMastery>;
  StudentObjectiveMasteryInput: StudentObjectiveMasteryInput;
  StudentTaskSubmissionResult: ResolverTypeWrapper<StudentTaskSubmissionResult>;
  SubGoal: ResolverTypeWrapper<SubGoal>;
  SubGoalInput: SubGoalInput;
  SubMission: ResolverTypeWrapper<Omit<SubMission, 'missionContent'> & { missionContent?: Maybe<Array<Maybe<ResolversTypes['MissionContent']>>> }>;
  SubMissionInput: SubMissionInput;
  Target: ResolverTypeWrapper<Target>;
  TargetInput: TargetInput;
  TargetProgress: ResolverTypeWrapper<TargetProgress>;
  Task: ResolverTypeWrapper<Task>;
  TaskBlock: ResolversTypes['FrBlock'] | ResolversTypes['ImageBlock'] | ResolversTypes['McBlock'] | ResolversTypes['QuizBlock'] | ResolversTypes['TextBlock'] | ResolversTypes['VideoBlock'];
  TaskInput: TaskInput;
  TaskObjectiveProgress: ResolverTypeWrapper<TaskObjectiveProgress>;
  TaskProgress: ResolverTypeWrapper<TaskProgress>;
  TaskProgressInput: TaskProgressInput;
  TaskStats: ResolverTypeWrapper<TaskStats>;
  TaskSubmissionGrade: ResolverTypeWrapper<TaskSubmissionGrade>;
  TaskSubmissionGradeInput: TaskSubmissionGradeInput;
  TaskSubmissionResult: ResolverTypeWrapper<TaskSubmissionResult>;
  TaskSubmissionSummary: ResolverTypeWrapper<TaskSubmissionSummary>;
  TextBlock: ResolverTypeWrapper<TextBlock>;
  TextBlockInput: TextBlockInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserOutput: ResolverTypeWrapper<UpdateUserOutput>;
  User: ResolverTypeWrapper<User>;
  UserProgress: ResolverTypeWrapper<UserProgress>;
  VideoBlock: ResolverTypeWrapper<VideoBlock>;
  VideoBlockInput: VideoBlockInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Answer: Answer;
  String: Scalars['String'];
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  AnswerGrade: AnswerGrade;
  AnswerGradeInput: AnswerGradeInput;
  ClassMissionMastery: ClassMissionMastery;
  ClassTargetMastery: ClassTargetMastery;
  CourseContent: CourseContent;
  CourseInfo: CourseInfo;
  CourseInput: CourseInput;
  Date: Scalars['Date'];
  FrBlock: FrBlock;
  FrBlockInput: FrBlockInput;
  FrQuestion: FrQuestion;
  FrQuestionInput: FrQuestionInput;
  FreeResponseAnswerInput: FreeResponseAnswerInput;
  Goal: Goal;
  GoalInput: GoalInput;
  ImageBlock: ImageBlock;
  ImageBlockInput: ImageBlockInput;
  MarketListing: MarketListing;
  MarketListingInput: MarketListingInput;
  McBlock: McBlock;
  McBlockInput: McBlockInput;
  McQuestion: McQuestion;
  McQuestionInput: McQuestionInput;
  Mission: Omit<Mission, 'missionContent'> & { missionContent: Array<ResolversParentTypes['MissionContent']> };
  MissionContent: ResolversParentTypes['Task'] | ResolversParentTypes['SubMission'];
  MissionInput: MissionInput;
  MissionProgress: MissionProgress;
  MultipleChoiceAnswerInput: MultipleChoiceAnswerInput;
  Mutation: {};
  Objective: Objective;
  ObjectiveInput: ObjectiveInput;
  ObjectiveMastery: ObjectiveMastery;
  ObjectiveProgress: ObjectiveProgress;
  ObjectiveTaskMastery: ObjectiveTaskMastery;
  ObjectiveTaskMasteryInput: ObjectiveTaskMasteryInput;
  Page: Page;
  PageInput: PageInput;
  Progress: Progress;
  ProgressInput: ProgressInput;
  ProgressOverview: ProgressOverview;
  ProgresssDeletionInput: ProgresssDeletionInput;
  Query: {};
  Question: ResolversParentTypes['FrQuestion'] | ResolversParentTypes['McQuestion'];
  QuestionAndAnswer: QuestionAndAnswer;
  QuestionOption: QuestionOption;
  QuestionProgress: QuestionProgress;
  QuizBlock: QuizBlock;
  QuizBlockInput: QuizBlockInput;
  Receipt: Receipt;
  RubricRequirement: RubricRequirement;
  RubricRequirementInput: RubricRequirementInput;
  Student: Student;
  StudentInput: StudentInput;
  StudentMissionMastery: StudentMissionMastery;
  Float: Scalars['Float'];
  StudentMissionMasteryInput: StudentMissionMasteryInput;
  StudentObjectiveMastery: StudentObjectiveMastery;
  StudentObjectiveMasteryInput: StudentObjectiveMasteryInput;
  StudentTaskSubmissionResult: StudentTaskSubmissionResult;
  SubGoal: SubGoal;
  SubGoalInput: SubGoalInput;
  SubMission: Omit<SubMission, 'missionContent'> & { missionContent?: Maybe<Array<Maybe<ResolversParentTypes['MissionContent']>>> };
  SubMissionInput: SubMissionInput;
  Target: Target;
  TargetInput: TargetInput;
  TargetProgress: TargetProgress;
  Task: Task;
  TaskBlock: ResolversParentTypes['FrBlock'] | ResolversParentTypes['ImageBlock'] | ResolversParentTypes['McBlock'] | ResolversParentTypes['QuizBlock'] | ResolversParentTypes['TextBlock'] | ResolversParentTypes['VideoBlock'];
  TaskInput: TaskInput;
  TaskObjectiveProgress: TaskObjectiveProgress;
  TaskProgress: TaskProgress;
  TaskProgressInput: TaskProgressInput;
  TaskStats: TaskStats;
  TaskSubmissionGrade: TaskSubmissionGrade;
  TaskSubmissionGradeInput: TaskSubmissionGradeInput;
  TaskSubmissionResult: TaskSubmissionResult;
  TaskSubmissionSummary: TaskSubmissionSummary;
  TextBlock: TextBlock;
  TextBlockInput: TextBlockInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserOutput: UpdateUserOutput;
  User: User;
  UserProgress: UserProgress;
  VideoBlock: VideoBlock;
  VideoBlockInput: VideoBlockInput;
}>;

export type AnswerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Answer'] = ResolversParentTypes['Answer']> = ResolversObject<{
  questionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pointsAwarded?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  graded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  teacherComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AnswerGradeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AnswerGrade'] = ResolversParentTypes['AnswerGrade']> = ResolversObject<{
  student?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pointsAwarded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  teacherComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClassMissionMasteryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassMissionMastery'] = ResolversParentTypes['ClassMissionMastery']> = ResolversObject<{
  mission?: Resolver<ResolversTypes['Mission'], ParentType, ContextType>;
  studentMissionMasteryList?: Resolver<Array<ResolversTypes['StudentMissionMastery']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClassTargetMasteryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassTargetMastery'] = ResolversParentTypes['ClassTargetMastery']> = ResolversObject<{
  target?: Resolver<ResolversTypes['Target'], ParentType, ContextType>;
  studentObjectiveMasteryList?: Resolver<Array<ResolversTypes['StudentObjectiveMastery']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CourseContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseContent'] = ResolversParentTypes['CourseContent']> = ResolversObject<{
  courseInfo?: Resolver<ResolversTypes['CourseInfo'], ParentType, ContextType>;
  missions?: Resolver<Array<ResolversTypes['Mission']>, ParentType, ContextType>;
  targets?: Resolver<Array<ResolversTypes['Target']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CourseInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseInfo'] = ResolversParentTypes['CourseInfo']> = ResolversObject<{
  courseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courseName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instructorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FrBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['FrBlock'] = ResolversParentTypes['FrBlock']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stem?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FrQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FrQuestion'] = ResolversParentTypes['FrQuestion']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feedback?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GoalResolvers<ContextType = any, ParentType extends ResolversParentTypes['Goal'] = ResolversParentTypes['Goal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  completedDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  subGoals?: Resolver<Array<ResolversTypes['SubGoal']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favorited?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignee?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pointValue?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImageBlock'] = ResolversParentTypes['ImageBlock']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarketListing'] = ResolversParentTypes['MarketListing']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listedDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  timesPurchased?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type McBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['McBlock'] = ResolversParentTypes['McBlock']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stem?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  answers?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type McQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['McQuestion'] = ResolversParentTypes['McQuestion']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['QuestionOption']>, ParentType, ContextType>;
  answers?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  feedback?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mission'] = ResolversParentTypes['Mission']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  missionContent?: Resolver<Array<ResolversTypes['MissionContent']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MissionContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['MissionContent'] = ResolversParentTypes['MissionContent']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Task' | 'SubMission', ParentType, ContextType>;
}>;

export type MissionProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['MissionProgress'] = ResolversParentTypes['MissionProgress']> = ResolversObject<{
  mission?: Resolver<ResolversTypes['Mission'], ParentType, ContextType>;
  progress?: Resolver<Array<ResolversTypes['TaskStats']>, ParentType, ContextType>;
  student?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFrBlock?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddFrBlockArgs, 'frBlock'>>;
  addFrQuestion?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddFrQuestionArgs, 'question'>>;
  addImageBlock?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddImageBlockArgs, 'imageblock'>>;
  addMarketListing?: Resolver<ResolversTypes['MarketListing'], ParentType, ContextType, RequireFields<MutationAddMarketListingArgs, 'course' | 'listing'>>;
  addMcBlock?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddMcBlockArgs, 'mcBlock'>>;
  addMcQuestion?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddMcQuestionArgs, 'question'>>;
  addMission?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddMissionArgs, 'mission'>>;
  addObjective?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddObjectiveArgs, 'objective'>>;
  addProgress?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddProgressArgs, 'progress'>>;
  addQuizBlock?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddQuizBlockArgs, 'quizblock'>>;
  addStudent?: Resolver<ResolversTypes['Student'], ParentType, ContextType, RequireFields<MutationAddStudentArgs, 'student'>>;
  addSubMission?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddSubMissionArgs, 'subMission'>>;
  addTarget?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddTargetArgs, 'target'>>;
  addTask?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddTaskArgs, 'task'>>;
  addTextBlock?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddTextBlockArgs, 'textblock'>>;
  addVideoBlock?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddVideoBlockArgs, 'videoblock'>>;
  changePoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationChangePointsArgs, 'course' | 'student' | 'points'>>;
  createCourse?: Resolver<ResolversTypes['CourseInfo'], ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'course'>>;
  deleteGoal?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteGoalArgs, 'id'>>;
  editMarketListing?: Resolver<ResolversTypes['MarketListing'], ParentType, ContextType, RequireFields<MutationEditMarketListingArgs, 'course' | 'id' | 'listing'>>;
  editOrCreateGoal?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationEditOrCreateGoalArgs, 'goal'>>;
  fulfillPurchase?: Resolver<ResolversTypes['Receipt'], ParentType, ContextType, RequireFields<MutationFulfillPurchaseArgs, 'course' | 'receiptId' | 'fulfilled'>>;
  gradeAnswer?: Resolver<ResolversTypes['AnswerGrade'], ParentType, ContextType, RequireFields<MutationGradeAnswerArgs, 'grade'>>;
  gradeObjectiveTaskMastery?: Resolver<ResolversTypes['ObjectiveTaskMastery'], ParentType, ContextType, RequireFields<MutationGradeObjectiveTaskMasteryArgs, 'grade'>>;
  gradeTaskSubmission?: Resolver<ResolversTypes['TaskSubmissionGrade'], ParentType, ContextType, RequireFields<MutationGradeTaskSubmissionArgs, 'grade'>>;
  purchase?: Resolver<ResolversTypes['Receipt'], ParentType, ContextType, RequireFields<MutationPurchaseArgs, 'course' | 'listingId' | 'quantity' | 'note'>>;
  removeMarketListing?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRemoveMarketListingArgs, 'course' | 'id'>>;
  saveFreeResponseProgress?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveFreeResponseProgressArgs, 'frBlockInput'>>;
  saveMultipleChoiceProgress?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveMultipleChoiceProgressArgs, 'mcBlockInput'>>;
  submitTask?: Resolver<ResolversTypes['TaskSubmissionResult'], ParentType, ContextType, RequireFields<MutationSubmitTaskArgs, 'taskId'>>;
  submitTaskProgress?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSubmitTaskProgressArgs, 'taskProgress'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UpdateUserOutput']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, never>>;
  wipeAllProgress?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationWipeAllProgressArgs, 'username'>>;
}>;

export type ObjectiveResolvers<ContextType = any, ParentType extends ResolversParentTypes['Objective'] = ResolversParentTypes['Objective']> = ResolversObject<{
  objectiveId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectiveName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ObjectiveMasteryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ObjectiveMastery'] = ResolversParentTypes['ObjectiveMastery']> = ResolversObject<{
  objectiveId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mastery?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ObjectiveProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['ObjectiveProgress'] = ResolversParentTypes['ObjectiveProgress']> = ResolversObject<{
  objectiveId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectiveName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes['TaskObjectiveProgress']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ObjectiveTaskMasteryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ObjectiveTaskMastery'] = ResolversParentTypes['ObjectiveTaskMastery']> = ResolversObject<{
  student?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectiveId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mastery?: Resolver<ResolversTypes['Mastery'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = ResolversObject<{
  blocks?: Resolver<Array<ResolversTypes['TaskBlock']>, ParentType, ContextType>;
  skippable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Progress'] = ResolversParentTypes['Progress']> = ResolversObject<{
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProgressOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProgressOverview'] = ResolversParentTypes['ProgressOverview']> = ResolversObject<{
  userProgress?: Resolver<Array<ResolversTypes['UserProgress']>, ParentType, ContextType>;
  courseInfo?: Resolver<ResolversTypes['CourseInfo'], ParentType, ContextType>;
  missions?: Resolver<Array<ResolversTypes['Mission']>, ParentType, ContextType>;
  targets?: Resolver<Array<ResolversTypes['Target']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  classMissionMastery?: Resolver<ResolversTypes['ClassMissionMastery'], ParentType, ContextType, RequireFields<QueryClassMissionMasteryArgs, 'missionId'>>;
  classTargetMastery?: Resolver<ResolversTypes['ClassTargetMastery'], ParentType, ContextType, RequireFields<QueryClassTargetMasteryArgs, 'targetId'>>;
  course?: Resolver<ResolversTypes['CourseInfo'], ParentType, ContextType, RequireFields<QueryCourseArgs, 'courseId' | 'instructorId'>>;
  courseContent?: Resolver<ResolversTypes['CourseContent'], ParentType, ContextType, RequireFields<QueryCourseContentArgs, 'course'>>;
  courses?: Resolver<Array<ResolversTypes['CourseInfo']>, ParentType, ContextType>;
  getAllEnrolledStudentMissionProgress?: Resolver<Array<ResolversTypes['MissionProgress']>, ParentType, ContextType, RequireFields<QueryGetAllEnrolledStudentMissionProgressArgs, 'courseId' | 'missionId'>>;
  getAllGoals?: Resolver<Array<ResolversTypes['Goal']>, ParentType, ContextType>;
  getAllMissionProgress?: Resolver<Array<ResolversTypes['MissionProgress']>, ParentType, ContextType, RequireFields<QueryGetAllMissionProgressArgs, 'courseId'>>;
  getAllTargetProgress?: Resolver<Array<ResolversTypes['TargetProgress']>, ParentType, ContextType, RequireFields<QueryGetAllTargetProgressArgs, 'courseId'>>;
  getGoalById?: Resolver<ResolversTypes['Goal'], ParentType, ContextType, RequireFields<QueryGetGoalByIdArgs, 'id' | 'user'>>;
  getMissionProgress?: Resolver<ResolversTypes['MissionProgress'], ParentType, ContextType, RequireFields<QueryGetMissionProgressArgs, 'missionId'>>;
  getTaskObjectiveProgress?: Resolver<Array<ResolversTypes['TaskObjectiveProgress']>, ParentType, ContextType, RequireFields<QueryGetTaskObjectiveProgressArgs, 'taskId'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  marketListings?: Resolver<Array<ResolversTypes['MarketListing']>, ParentType, ContextType, RequireFields<QueryMarketListingsArgs, 'course'>>;
  mission?: Resolver<ResolversTypes['Mission'], ParentType, ContextType, RequireFields<QueryMissionArgs, never>>;
  missions?: Resolver<Array<ResolversTypes['Mission']>, ParentType, ContextType, RequireFields<QueryMissionsArgs, never>>;
  objective?: Resolver<ResolversTypes['Objective'], ParentType, ContextType, RequireFields<QueryObjectiveArgs, 'objectiveId'>>;
  objectives?: Resolver<Array<ResolversTypes['Objective']>, ParentType, ContextType, RequireFields<QueryObjectivesArgs, 'course'>>;
  progressByCourse?: Resolver<Array<ResolversTypes['UserProgress']>, ParentType, ContextType, RequireFields<QueryProgressByCourseArgs, 'course'>>;
  progressOverview?: Resolver<ResolversTypes['ProgressOverview'], ParentType, ContextType, RequireFields<QueryProgressOverviewArgs, 'course'>>;
  questions?: Resolver<Array<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<QueryQuestionsArgs, 'questionIds'>>;
  quizblock?: Resolver<ResolversTypes['QuizBlock'], ParentType, ContextType, RequireFields<QueryQuizblockArgs, 'taskId' | 'blockId'>>;
  recentPurchases?: Resolver<Array<ResolversTypes['Receipt']>, ParentType, ContextType, RequireFields<QueryRecentPurchasesArgs, 'course' | 'fetch'>>;
  retrieveQuestionProgress?: Resolver<ResolversTypes['QuestionProgress'], ParentType, ContextType, RequireFields<QueryRetrieveQuestionProgressArgs, 'taskId'>>;
  retrieveTaskProgress?: Resolver<Maybe<ResolversTypes['TaskProgress']>, ParentType, ContextType, RequireFields<QueryRetrieveTaskProgressArgs, 'taskId'>>;
  retrieveTaskSubmission?: Resolver<Maybe<ResolversTypes['TaskSubmissionResult']>, ParentType, ContextType, RequireFields<QueryRetrieveTaskSubmissionArgs, 'taskId'>>;
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType, RequireFields<QueryStudentArgs, 'courseId'>>;
  students?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType, RequireFields<QueryStudentsArgs, 'courseId'>>;
  subMission?: Resolver<Maybe<ResolversTypes['SubMission']>, ParentType, ContextType, RequireFields<QuerySubMissionArgs, never>>;
  target?: Resolver<ResolversTypes['Target'], ParentType, ContextType, RequireFields<QueryTargetArgs, 'targetId'>>;
  targets?: Resolver<Array<ResolversTypes['Target']>, ParentType, ContextType, RequireFields<QueryTargetsArgs, 'course'>>;
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<QueryTaskArgs, never>>;
  taskInfo?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<QueryTaskInfoArgs, 'taskId'>>;
  taskSubmissionSummary?: Resolver<ResolversTypes['TaskSubmissionSummary'], ParentType, ContextType, RequireFields<QueryTaskSubmissionSummaryArgs, 'course' | 'taskId'>>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTasksArgs, never>>;
  tasksByCourse?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTasksByCourseArgs, 'course'>>;
  unfulfilledPurchases?: Resolver<Array<ResolversTypes['Receipt']>, ParentType, ContextType, RequireFields<QueryUnfulfilledPurchasesArgs, 'course'>>;
  userProgress?: Resolver<ResolversTypes['UserProgress'], ParentType, ContextType, RequireFields<QueryUserProgressArgs, 'userName' | 'course'>>;
}>;

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = ResolversObject<{
  __resolveType: TypeResolveFn<'FrQuestion' | 'McQuestion', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  feedback?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type QuestionAndAnswerResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionAndAnswer'] = ResolversParentTypes['QuestionAndAnswer']> = ResolversObject<{
  question?: Resolver<ResolversTypes['Question'], ParentType, ContextType>;
  answer?: Resolver<Maybe<ResolversTypes['Answer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOption'] = ResolversParentTypes['QuestionOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuestionProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionProgress'] = ResolversParentTypes['QuestionProgress']> = ResolversObject<{
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  answers?: Resolver<Array<ResolversTypes['Answer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuizBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuizBlock'] = ResolversParentTypes['QuizBlock']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  requiredScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  questions?: Resolver<Array<ResolversTypes['Question']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReceiptResolvers<ContextType = any, ParentType extends ResolversParentTypes['Receipt'] = ResolversParentTypes['Receipt']> = ResolversObject<{
  studentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  listing?: Resolver<ResolversTypes['MarketListing'], ParentType, ContextType>;
  receiptId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  note?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purchaseDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  pointsSpent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fulfilled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RubricRequirementResolvers<ContextType = any, ParentType extends ResolversParentTypes['RubricRequirement'] = ResolversParentTypes['RubricRequirement']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = ResolversObject<{
  studentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instructorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courseName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPointsAwarded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPointsSpent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentMissionMasteryResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentMissionMastery'] = ResolversParentTypes['StudentMissionMastery']> = ResolversObject<{
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  currentTaskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentTaskName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentObjectiveMasteryResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentObjectiveMastery'] = ResolversParentTypes['StudentObjectiveMastery']> = ResolversObject<{
  student?: Resolver<ResolversTypes['Student'], ParentType, ContextType>;
  objectiveMasteryList?: Resolver<Array<ResolversTypes['ObjectiveMastery']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StudentTaskSubmissionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentTaskSubmissionResult'] = ResolversParentTypes['StudentTaskSubmissionResult']> = ResolversObject<{
  studentName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pointsAwarded?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  graded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  teacherComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submitted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubGoalResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubGoal'] = ResolversParentTypes['SubGoal']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  completedDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubMissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubMission'] = ResolversParentTypes['SubMission']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  missionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  missionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  objectiveId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  missionContent?: Resolver<Maybe<Array<Maybe<ResolversTypes['MissionContent']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TargetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Target'] = ResolversParentTypes['Target']> = ResolversObject<{
  targetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gradeLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  standards?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectives?: Resolver<Array<ResolversTypes['Objective']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TargetProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['TargetProgress'] = ResolversParentTypes['TargetProgress']> = ResolversObject<{
  target?: Resolver<ResolversTypes['Target'], ParentType, ContextType>;
  objectives?: Resolver<Array<ResolversTypes['ObjectiveProgress']>, ParentType, ContextType>;
  student?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  endAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dueDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType>;
  requirements?: Resolver<Array<ResolversTypes['RubricRequirement']>, ParentType, ContextType>;
  course?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  missionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  missionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  subMissionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  objectiveId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  targetId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskBlock'] = ResolversParentTypes['TaskBlock']> = ResolversObject<{
  __resolveType: TypeResolveFn<'FrBlock' | 'ImageBlock' | 'McBlock' | 'QuizBlock' | 'TextBlock' | 'VideoBlock', ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type TaskObjectiveProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskObjectiveProgress'] = ResolversParentTypes['TaskObjectiveProgress']> = ResolversObject<{
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  objective?: Resolver<ResolversTypes['Objective'], ParentType, ContextType>;
  mastery?: Resolver<ResolversTypes['Mastery'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskProgress'] = ResolversParentTypes['TaskProgress']> = ResolversObject<{
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  finishedRequirementIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskStats'] = ResolversParentTypes['TaskStats']> = ResolversObject<{
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submission?: Resolver<Maybe<ResolversTypes['TaskSubmissionResult']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskSubmissionGradeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskSubmissionGrade'] = ResolversParentTypes['TaskSubmissionGrade']> = ResolversObject<{
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  student?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teacherComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pointsAwarded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskSubmissionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskSubmissionResult'] = ResolversParentTypes['TaskSubmissionResult']> = ResolversObject<{
  graded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pointsAwarded?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pointsPossible?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  questionAndAnswers?: Resolver<Maybe<Array<ResolversTypes['QuestionAndAnswer']>>, ParentType, ContextType>;
  teacherComment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskSubmissionSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskSubmissionSummary'] = ResolversParentTypes['TaskSubmissionSummary']> = ResolversObject<{
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['StudentTaskSubmissionResult']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TextBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['TextBlock'] = ResolversParentTypes['TextBlock']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contents?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fontSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateUserOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserOutput'] = ResolversParentTypes['UpdateUserOutput']> = ResolversObject<{
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProgress'] = ResolversParentTypes['UserProgress']> = ResolversObject<{
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<Array<ResolversTypes['Progress']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VideoBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoBlock'] = ResolversParentTypes['VideoBlock']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  videoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Answer?: AnswerResolvers<ContextType>;
  AnswerGrade?: AnswerGradeResolvers<ContextType>;
  ClassMissionMastery?: ClassMissionMasteryResolvers<ContextType>;
  ClassTargetMastery?: ClassTargetMasteryResolvers<ContextType>;
  CourseContent?: CourseContentResolvers<ContextType>;
  CourseInfo?: CourseInfoResolvers<ContextType>;
  Date?: GraphQLScalarType;
  FrBlock?: FrBlockResolvers<ContextType>;
  FrQuestion?: FrQuestionResolvers<ContextType>;
  Goal?: GoalResolvers<ContextType>;
  ImageBlock?: ImageBlockResolvers<ContextType>;
  MarketListing?: MarketListingResolvers<ContextType>;
  McBlock?: McBlockResolvers<ContextType>;
  McQuestion?: McQuestionResolvers<ContextType>;
  Mission?: MissionResolvers<ContextType>;
  MissionContent?: MissionContentResolvers<ContextType>;
  MissionProgress?: MissionProgressResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Objective?: ObjectiveResolvers<ContextType>;
  ObjectiveMastery?: ObjectiveMasteryResolvers<ContextType>;
  ObjectiveProgress?: ObjectiveProgressResolvers<ContextType>;
  ObjectiveTaskMastery?: ObjectiveTaskMasteryResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  Progress?: ProgressResolvers<ContextType>;
  ProgressOverview?: ProgressOverviewResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  QuestionAndAnswer?: QuestionAndAnswerResolvers<ContextType>;
  QuestionOption?: QuestionOptionResolvers<ContextType>;
  QuestionProgress?: QuestionProgressResolvers<ContextType>;
  QuizBlock?: QuizBlockResolvers<ContextType>;
  Receipt?: ReceiptResolvers<ContextType>;
  RubricRequirement?: RubricRequirementResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  StudentMissionMastery?: StudentMissionMasteryResolvers<ContextType>;
  StudentObjectiveMastery?: StudentObjectiveMasteryResolvers<ContextType>;
  StudentTaskSubmissionResult?: StudentTaskSubmissionResultResolvers<ContextType>;
  SubGoal?: SubGoalResolvers<ContextType>;
  SubMission?: SubMissionResolvers<ContextType>;
  Target?: TargetResolvers<ContextType>;
  TargetProgress?: TargetProgressResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskBlock?: TaskBlockResolvers<ContextType>;
  TaskObjectiveProgress?: TaskObjectiveProgressResolvers<ContextType>;
  TaskProgress?: TaskProgressResolvers<ContextType>;
  TaskStats?: TaskStatsResolvers<ContextType>;
  TaskSubmissionGrade?: TaskSubmissionGradeResolvers<ContextType>;
  TaskSubmissionResult?: TaskSubmissionResultResolvers<ContextType>;
  TaskSubmissionSummary?: TaskSubmissionSummaryResolvers<ContextType>;
  TextBlock?: TextBlockResolvers<ContextType>;
  UpdateUserOutput?: UpdateUserOutputResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserProgress?: UserProgressResolvers<ContextType>;
  VideoBlock?: VideoBlockResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
