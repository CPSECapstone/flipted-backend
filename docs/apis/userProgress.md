# User Progress

## APIs

* Get All User Mission Progress

## Examples

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