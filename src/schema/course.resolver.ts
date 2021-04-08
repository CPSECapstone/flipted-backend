import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { CourseInput } from "../interfaces";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });
const COURSE_TABLE = "Courses-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true
};

const resolvers = {
  Query: {
    courses: async () => {
      const command = new ScanCommand({ TableName: COURSE_TABLE });
      try {
        const results = await client.send(command);
        const courses: any[] = [];
        if (results.Items) {
          results.Items.forEach((item: any) => {
            courses.push(unmarshall(item));
          });
        }
        return courses;
      } catch (err) {
        console.error(err);
        return err;
      }
    }
  },
  Mutation: {
    addCourse: async (_: any, args: any, context: any, info: any) => {
      const course: CourseInput = args.course;
      const params = {
        TableName: COURSE_TABLE,
        Item: marshall({
          "id": uid(),
          "name": course.name,
          "description": course.description,
          "instructor": course.instructor,
        }, marshallOpts),
        ReturnValues: "ALL_OLD",
      }
      const command = new PutItemCommand(params);
      try {
        const result = client.send(command);
        return unmarshall(params.Item);
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
}

export default resolvers;
