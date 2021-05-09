# Courses

## APIs

* Add Course
* Get Course Info \(basic information only\)
* List Course Infos
* Get Course Content \(including all missions, targets, objectives\)

## Examples

### Add Couse

```graphql
mutation AddCourse {
  addCourse(
    course: {
      courseName: "Integrated Science"
      description: "Our first ever course"
      instructor: "Christian"
    }
  )
}
```

### Get Course Info

```graphql
query GetCourseInfo {
  courseInfo(courseId: "e510f27e125") {
    courseId
    course
    description
    instructor
  }
}
```

### List Course Infos

```graphql
query GetCourseInfos {
  courseInfos(instructor: "Mr. Butcher") {
    courseId
    course
    description
    instructor
  }
}
```

### Get Course Content

```text
query GetCourseContent{
  courseContent(course: "Integrated Science") {
    courseInfo {
      courseId
      course
      description
      instructor
    }
    missions {
      id
      course
      name
      description
    }
    targets {
      targetId
      targetName
      description
      subject
      gradeLevel
      icon
      standards
      course
    }
    objectives {
      objectiveId
      objectiveName
      description
      targetId
      targetName
      course
    }
    taskInfos {
      taskInfoId
      taskName
      course
      targetId
      objectiveId
      missionId
      subMissionId
    }
  }
}
```

