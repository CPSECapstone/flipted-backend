# Class Roster

## API

* Add Student To Course
* Get Student By StudentId and Course
* List Roster By Course

## Examples

### Add Student To Course

```graphql
mutation AddStudent {
  addStudent(
    student: {
      studentId: "Test Student Id 1"
      studentName: "Test Student Name 1"
      course: "Integrated Science"
      section: "1"
      team: "Gamma"
    }
  )
}
```

### Get Student By StudentId and Course

```graphql
query Student {
  student(studentId: "Test Student Id 1", course: "Integrated Science") {
    studentId
    studentName
    course
    section
    team
  }
}
```

### List Students By Course

```graphql
query Roster {
  students(course: "Integrated Science") {
    studentId
    studentName
    course
    section
    team
  }
}
```
