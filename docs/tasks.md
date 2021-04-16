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
      name: "Destin's Awesome Task!"
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
          ]
        }
        {
          skippable: false
          blocks: [
            {
              title: "Welcome to the second page"
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
  task(taskId: "4f150df2e8d"){
    id
    requirements
    {
      id
      description
      isComplete
    }
    name
    pages{
      skippable
      blocks
      {
        title
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
