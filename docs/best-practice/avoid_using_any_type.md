# Avoid using any type

## Benefits of type checking

We are benefited from the type checking \(compile time\) feature of Typescript in two ways 1. The typescript compiler \(built-in feature of VS code\) will complaining any mismatch when you assign one type \(interface\) of an object to another type. For example

```typescript
type Course = {
   courseName: string;
}

const course: Course = {
   courename: "Integrated Science",
}

Type '{ courename: string; }' is not assignable to type 'Course'.
  Object literal may only specify known properties, but 'courename' does not exist in type 'Course'. Did you mean to write 'courseName'?
```

1. The **intellisense** feature of VS Code also relies on the type system to provide auto-suggestion while we are coding.

However, if we use `any` for an object, we lose the benefits listed above.

## Define your own types or interfaces

1. With `graph-code-generator` tool, we can generate all the needed types on the GraphQL side. There are three scienarios where we use these generated types
   * The input type of a service API method

     ```typescript
     // service/course.ts
     export async function getCourseInfo(courseId: string): Promise<CourseInfo> {
      ...
     }
     ```

   * The return type of a service API method

     ```typescript
     // service/course.ts
     export async function addCourse(input: CourseInput): Promise<string> {
      ...
     }
     ```

   * The arguments of query request. The `QueryCourseContentArgs` is generated from `GraphQL`, and the resolver is the perfect place to use the type.

     ```typescript
     // course.resolver.ts
     async function getCourseContent(_: any, args: QueryCourseContentArgs) {
      return service.getCourseContent(args.course);
     }
     ```
2. On the database side, we also need to define `[Entity]Item` type \(interface\) to reflect how an entity is stored in the database.

## Cases where `any` is unavoidable

1. The item\(s\) in the output from a database query is/are `any` type. The compiler has no way to figure that out.

   > There may be a solution for this at here [Introducing the Amazon DynamoDB DataMapper for JavaScript – Developer Preview](https://aws.amazon.com/blogs/developer/introducing-the-amazon-dynamodb-datamapper-for-javascript-developer-preview/)

2. When you try to define a type of an object, where the object has some properties that are nested object. In the example below, we don't know what value would be for the `expressionAttributeValues`

```typescript
// service/dynamodb.ts
interface interface UpdateParams {
   tableName: string;
   key: string;
   updateExpression: string;
   expressionAttributeValues: { [key: string]: any };
}
```

Unless there's a strong reason to use `any`, it's not recommanded in our project.

