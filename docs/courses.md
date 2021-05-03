## Course

### APIs

-  Add Course
-  Get Course Info (basic information only)
-  List Course Infos
-  Get Course Content (including all missions, targets, objectives)

### Examples

#### Add Couse

```graphql
mutation AddCourse {
  addCourse(
    course: {
      name: "Integrated Science"
      description: "Our first ever course"
      instructor: "Christian"
    }
  )
}
```

#### Get Course Info

```graphql
query GetCourseInfo {
  courseInfo(courseName: "Integrated Science", courseId: "15dfe43a702") {
    courseId
    name
    description
    instructor
  }
}
```

#### List Course Infos

```graphql
query GetCourseInfos {
  courseInfos(instructor: "Mr. Butcher") {
    courseId
    name
    description
    instructor
  }
}
```

#### Get Course Content

```
// todo
```
