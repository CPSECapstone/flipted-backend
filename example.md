### GraphQL examples

```
# add user
mutation {
  addUser(user: {
    firstName: "haha",
    lastName: "Doe"
  }) {
    lastName
  }
}
```

```
query {
  getUsers(){
    id
    firstName
    lastName
  }
}
```

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
```

### Add a Mission

```
mutation {
  addMission(mission: {
    name: "New Mission",
    description: "Mission to do"
  }) {
    name
    description
  }
}
```
