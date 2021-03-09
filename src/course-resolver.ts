const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { environment } = require("./environment");
const client = new DynamoDBClient({ region: "us-east-1" });

export class CourseResolvers {
  getCourses = async () => {
    const params = {
      TableName: "Courses-" + environment.stage,
    };
  
    try {
      const results = await client.send(new ScanCommand(params));
      const courses: any[] = [];
      results.Items.forEach((item : any) => {
        courses.push(unmarshall(item));
      });
      return courses;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  addCourse = async () => {

  }
}