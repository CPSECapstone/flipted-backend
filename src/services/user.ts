import { unmarshall } from "@aws-sdk/util-dynamodb";
import { USERS_TABLE_NAME } from "../environment";
import { RoleInternal } from "../interfaces/role";
import dynamodb, { ScanParams } from "./dynamodb";

async function get(userId: string): Promise<User> {
   const params = {
      tableName: USERS_TABLE_NAME,
      key: userId
   };

   const output = await dynamodb.get(params);
   if (output.Item) {
      return <User>unmarshall(output.Item);
   }
   throw new Error(`username: ${userId} not found`);
}

/**
 * Returns the role of the user given the user id contained in the JWT access token
 * Should be either "instructor" or "student"
 */
async function getUserRole(userId: string): Promise<RoleInternal> {
   return (await get(userId)).role.toString() as RoleInternal;
}

async function update(userId: string, input: UpdateUserInput) {
   const params = {
      tableName: USERS_TABLE_NAME,
      key: userId,
      updateExpression: "SET firstName = :fname, lastName = :lname",
      expressionAttributeValues: {
         ":fname": input.firstName,
         ":lname": input.lastName
      }
   };
   const output = await dynamodb.update(params);
   if (output.Attributes) {
      return unmarshall(output.Attributes);
   }
}

async function listUsersByRole(role: string): Promise<User[]> {
   const params: ScanParams = {
      tableName: USERS_TABLE_NAME,
      filterExpression: "#user_role = :roleVal",
      expressionAttributeValues: {
         ":roleVal": role
      },
      expressionAttributeNames: { "#user_role": "role" },
      limit: 50
   };

   try {
      const output = await dynamodb.scan(params);
      if (output.Items) {
         const users: User[] = output.Items.map(rawItem => {
            return <User>unmarshall(rawItem);
         });
         return users;
      }

      return [];
   } catch (err) {
      return err;
   }
}

const userService = {
   get,
   update,
   getUserRole,
   listUsersByRole
};

export default userService;
