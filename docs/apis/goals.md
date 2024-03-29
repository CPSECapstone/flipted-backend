# Goals

## APIs

* Get Goal by User and Id
* Get All Assigned Goals
* Edit or Create A Goal
* Delete a Goal

## Examples

### Get Goal by User and Id

```text
query getGoalById {
  getGoalById(id: "055cc2ce491", user: "Google_114560337406279161954") {
    title
  }
}
```

### Get All Assigned Goals

```text
query getGoals {
  getAllGoals {
    id
    title
    dueDate
    completed
    completedDate
    category
    favorited
    owner
    assignee
    pointValue
    subGoals {
      title
      dueDate
      completed
      completedDate
    }
  }
}
```

### Edit or Create a Goal

```text
mutation createNewGoal {
  editOrCreateGoal(
    goal: {
      title: "EAT ICE CREAM!"
      dueDate: "2022-03-05"
      completed: true
      completedDate: "2022-03-04"
      category: "Emotional"
      favorited: false
      subGoals: [
        { title: "MINT CHOCOLATE!", dueDate: "2022-03-05", completed: false }
        { title: "VANILLA!", dueDate: "2022-03-05", completed: false }
      ]
    }
  )
}

mutation editGoal {
  editOrCreateGoal(
    goal: {
      id: "b3765c47ce3"
      title: "Got no goals!"
      dueDate: "2022-03-05"
      completed: true
      category: "Logical"
      favorited: false
      subGoals: []
    }
  )
}
```

### Delete a Goal

```text
mutation deleteGoal{
  deleteGoal(id: "32cd7573ccd")
}
```