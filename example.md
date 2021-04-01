### GraphQL examples

### Add a Task

```
mutation {
  addTask(task: {
    name: "Exciting Task"
    description: "You are going to be excited"
    link: "Google.com"
  }) {
    name
    description
    link
  }
}

# get tasks
{
  tasks {
    id
    name
    description
    link
  }
}
```

### Missions

```
mutation {
  addMission(mission: {
    name: "New Mission",
    description: "Mission to do",
    tasks: []
  }) {
    id
    name
    description
  }
}

# getMissions
{
  missions {
    id
    name
    description
    tasks {
      id
      name
      description
      link
    }
  }
}
```

### Courses

```
# addCourse
mutation {
  addCourse(course: {
    name: "English 131"
    instructor: "Dr. Fauci"
    description: "Writing and Rhetoric Stretch",
    missions:[]
  }) {
    name
    instructor
    description
  }
}

# getCourses
{
  courses {
    id
    name
    instructor
    description
  }
}
```
