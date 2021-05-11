# User Progress

## APIs

* Get All User Mission Progress
* Get All User Learning Target Progress

## Examples

### Get All User Learning Target Progress
```
query GetTargetProgress {
  getAllTargetProgress(courseId: "sample") {
    student,
    target {
      targetName
    }
    objectives {
      objectiveId
      objectiveName
      tasks {
        taskId
        taskName
        mastery
      }
    }
  }
}
```

### Get All User Mission Progress
```
query GetMissionProgress {
  getAllMissionProgress(courseId: "Potato") {
    student,
    mission {
      name,
      description,
      id,
      course,
    }
    progress {
      name,
      taskId,
      submission {
        graded
        pointsAwarded,
        pointsPossible,
      }
    }
  }
}
```