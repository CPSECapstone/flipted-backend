```graphql
mutation {
  addTaskInfo(taskInfo: {
    taskName: "SH 1.1"
    course: "Integrated Science"
    targetId: "8ed63da3ff3"
    objectiveId: "b22752fdfdf"
    missionId: "da0719ba103"
  })
}
```

query {
  taskInfo(taskInfoId: "bec67324268") {
    taskInfoId
    taskName
    course
    targetId
    objectiveId
    missionId
    subMissionId
  }
}

query {
  taskInfos(course: "Integrated Science") {
    taskInfoId
    taskName
    course
    targetId
    objectiveId
    missionId
    subMissionId
  }
}
