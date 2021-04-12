## Tasks

### APIs

- Add Task
- Get Task By Id
- List Tasks By SubMission Id

### Examples

#### Add Task

```
mutation addTask {
  addTask(
    task: {
      name: "AwesomeTask"
      instructions: "Follow these instructions"
      points: 3
      subMissionId: "0"
      objectiveId: "0"
      pages: [
        {
          canAdvanceBeforeRubricRequirementsComplete: false
          blocks: [
            {
              title: "My First Block"
              requirement: {
                description: "Read this first block"
                isComplete: false
              }
              type: TEXT
              textBlockInput: {
                contents: "This is the contents of this first block"
                fontSize: 12
              }
            }
            {
              title: "Here is an image"
              requirement: {
                description: "Look at this image"
                isComplete: false
              }
              type: IMAGE
              imageBlockInput: { imageUrl: "https://i.imgur.com/tmawqgH.jpg" }
            }
          ]
        }
        {
          canAdvanceBeforeRubricRequirementsComplete: false
          blocks: [
            {
              title: "Welcome to the second page"
              requirement: {
                description: "Read this block"
                isComplete: false
              }
              type: TEXT
              textBlockInput: {
                contents: "This is the contents of this second page first block"
                fontSize: 12
              }
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
{
  task(taskId: "fc566d1bb09"){
    id
    name
    instructions
    subMissionId
    objectiveId
    points
    pages{
      canAdvanceBeforeRubricRequirementsComplete
      blocks
      {
        title
        requirement {
          id
          description
          isComplete
        }
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
    }
  }
}
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
