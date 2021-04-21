## Tasks

### APIs

-  Add Task
-  Get Task By Id
-  List Tasks By SubMission Id

### Examples

#### Add Task

```
mutation addTask {
  addTask(
    task: {
      name: "A song of fire and ice"
      instructions: "Follow these instructions"
      points: 3
      subMissionId: "0"
      objectiveId: "0"
      requirements: [
        { description: "Do this thing" }
        { description: "Do this other thing" }
        { description: "Finally, do this last thing" }
      ]
      pages: [
        {
          skippable: false
          blocks: [
            {
              title: "My First Block"
              type: TEXT
              textBlockInput: { contents: "", fontSize: 12 }
            }
            {
              title: "Here is an image"
              type: IMAGE
              imageBlockInput: { imageUrl: "https://i.imgur.com/tmawqgH.jpg" }
            }
            {
              title: "Here is a quiz block"
              type: QUIZ
              blockId: "QUIZ_BLOCK#d56778bc210"
            }
          ]
        }
      ]
    }
  )
}
```

#### Get Task By Id

```
query {
  task(taskId: "e2389f2fafd") {
    id
    requirements {
      id
      description
      isComplete
    }
    name
    pages {
      skippable
      blocks {
        title
        __typename
        ... on ImageBlock {
          imageUrl
        }
        ... on TextBlock {
          contents
          fontSize
        }
        ... on VideoBlock {
          videoUrl
        }
        ... on QuizBlock {
          requiredScore
          questions {
            __typename
            ...on FRQuestion {
              id
              description
              answer
            }
            ...on MCQuestion {
              id
              description
              options {
                id
                description
              }
              answers
            }
          }
        }
      }
    }
  }
}
```

#### Submit Progress Towards a Task

```
mutation submitTaskProgress {
  submitTaskProgress(taskProgress: {
    taskId: "f11589920bf"
    finishedBlockIds: ["8e1abeb0b94", "bf30375842a", "33c7eb99d37"]
  })
}
```

#### List Tasks By SubMission Id

```
query {
  tasks(subMissionId: "sub-mission 1") {
    id
    name
    instructions
    subMissionId
  }
}
```
