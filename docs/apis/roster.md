# Class Roster

## API

* Add Student To Course
* Get Student By StudentId and Course
* List Students By Course

## Examples

### Add Student To Course

```graphql
mutation AddStudent {
  addStudent(
    student: {
      studentId: "Test Student Id 1"
      email: "Test Student email 1"
      firstName: "Test Student firstName 1"
      lastName: "Test Student lastName 1"
      course: "Integrated Science"
      section: 1
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
    email
    firstName
    lastName
    course
    section
    team
  }
}
```

### List Students By Course

```graphql
query Students {
  students(course: "Integrated Science") {
    studentId
    email
    firstName
    lastName
    course
    section
    team
  }
}
```
