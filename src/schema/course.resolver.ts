import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";

const client = new DynamoDBClient({ region: "us-east-1" });
const COURSE_TABLE = "Courses-" + environment.stage;

const resolvers = {
  Query: {
    getCourses: async () => {
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
    addCourse: async () => { }
  }
}

export default resolvers;
