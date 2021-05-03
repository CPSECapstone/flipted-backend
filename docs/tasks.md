## Tasks

### APIs

-  Add Task
-  Add Text Block To Task
-  Add Image Block To Task
-  Add Video Block To Task
-  Add Quiz Block To Task
-  Get Task By Id

-  List Tasks By SubMission Id

### Examples

#### Add Task

```
mutation {
  addTask(
    task: {
      name: "A song of fire and ice"
      instructions: "Follow these instructions"
      points: 3
      subMissionId: "0"
      objectiveId: "0"
      pages: [
        {skippable: true},
        {skippable: true}
      ]
      requirements: [
        { description: "Do this thing" }
        { description: "Do this other thing" }
        { description: "Finally, do this last thing" }
      ]
    }
  )
}
```

### Add Text Block To Task

```
mutation {
  addTextBlock(textblock: {
    taskId: "c5110abd8c4"
    title: "Introduction to GOT",
    pageIndex: 0,
    blockIndex: 0
    contents: "A Song of Ice and Fire is a series of epic fantasy novels by the American novelist and screenwriter George R. R. Martin."
    fontSize: 15
  })
}
```

### Add Image Block To Task

```
mutation {
  addImageBlock(
    imageblock: {
      taskId: "c5110abd8c4"
      title: "Introduction to GOT"
      pageIndex: 0
      blockIndex: 1
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/dc/A_Song_of_Ice_and_Fire_book_collection_box_set_cover.jpg"
    }
  )
}
```

### Add Video Block To Task

```
mutation {
  addVideoBlock(
    videoblock: {
      taskId: "c5110abd8c4"
      title: "The Game of Thrones Series Finale Ending Explained"
      pageIndex: 1
      blockIndex: 0
      videoUrl: "https://www.youtube.com/watch?v=V7y1IGyPo_w"
    }
  )
}
```

### Add Quiz Block To Task

```
mutation {
  addQuizBlock(
    quizblock: {
      taskId: "c5110abd8c4"
      title: "Quiz on Game of Thrones"
      pageIndex: 1
      blockIndex: 1
      requiredScore: 20
      points: 20
      questionIds: ["FR_QUESTION#c375b5a56f8", "MC_QUESTION#a9bfcb78e7d"]
    }
  )
}
```

#### Get Task By Id

```
query {
  task(taskId: "c5110abd8c4") {
    id
    requirements {
      id
      description
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
            ...on FrQuestion {
              id
              description
              answer
            }
            ...on McQuestion {
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
