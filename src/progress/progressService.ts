import { USER_PROGRESS_TABLE_NAME } from "../environment";
import dynamodb, {
   PutCompositeParams,
   ScanParams,
   QueryParams,
   DeleteParam
} from "../services/dynamodb";
import * as helper from "./progressHelper";
import { ProgressPK } from "./progressInterface";
import * as courseService from "../services/course";
import usersData from "./users.json";
import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";
import taskSubmissionService from "../submissions/taskSubmission";
import missionService from "../services/mission";
import taskService from "../services/task";
import { generateMissionProgress } from "./progressHelper";

export async function addProgress(input: ProgressInput): Promise<string> {
   const courseItem = helper.progressInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      item: courseItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return courseItem.SK;
   } catch (err) {
      return err;
   }
}

export async function getUserProgress(userName: string, course: string): Promise<UserProgress> {
   const params: QueryParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": ProgressPK(userName, course)
      }
   };

   try {
      const output = await dynamodb.query(params);
      const userProgress = helper.dbItemsToUserProgress(userName, output.Items || []);
      return userProgress;
   } catch (err) {
      return err;
   }
}

export async function getProgressByCourse(course: string): Promise<UserProgress[]> {
   const params: ScanParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      filterExpression: "course = :courseVal",
      expressionAttributeValues: {
         ":courseVal": course
      }
   };

   try {
      const output = await dynamodb.scan(params);
      if (output.Items) {
         const progressList = helper.dbItemsToProgressList(output.Items);
         return progressList;
      }

      return [];
   } catch (err) {
      console.error(err);
      return err;
   }
}

export async function getProgressOverview(course: string): Promise<ProgressOverview> {
   try {
      const progress: UserProgress[] = await getProgressByCourse(course);
      const progressMap = new Map<string, UserProgress>();
      progress.forEach(element => {
         progressMap.set(element.userName, element);
      });

      // userData is read from local json file, contaiing a list of username
      // FIXME
      const userProgress: UserProgress[] = usersData.users.map((userName: any) => {
         return (
            progressMap.get(userName) || {
               userName,
               progress: []
            }
         );
      });

      const courseContent = await courseService.getCourseContent(course);

      return {
         userProgress,
         courseInfo: courseContent.courseInfo,
         missions: courseContent.missions,
         targets: courseContent.targets
      };
   } catch (err) {
      console.error(err);
      return err;
   }
}

export async function deleteProgress(input: ProgresssDeletionInput): Promise<number> {
   const params: DeleteParam = {
      tableName: USER_PROGRESS_TABLE_NAME,
      key: {
         PK: ProgressPK(input.userName, input.course),
         SK: input.taskId
      }
   };
   try {
      const output = await dynamodb.deleteItem(params);
      return output.ConsumedCapacity?.CapacityUnits || 0;
   } catch (err) {
      console.error(err);
      return err;
   }
}

export async function getAllMissionProgressForUser(course: string, username: string) : Promise<MissionProgress[]> {
    const missions: Promise<Mission[]> = missionService.listByCourse(course)
    const tasks: Promise<Task[]> = taskService.listTasksByCourse(course)
    const taskSubmissions: Promise<TaskSubmissionResultItem[]> = taskSubmissionService.listUserSubmissionsByCourse(course, username) // TODO: write this
    const missionProgress: MissionProgress[] = generateMissionProgress(await missions, await tasks, await taskSubmissions, username) // TODO: write this
    return missionProgress
}


