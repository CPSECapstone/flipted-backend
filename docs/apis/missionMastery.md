# Class Mission Mastery

## APIS

* Query Class Mission Mastery By MissionId

## Examples

```graphql
query ClassMissionMastery {
  classMissionMastery(
    courseId: "Integrated Science"
    missionId: "4df2cfa5710"
  ) {
    mission {
      ...CMMissionFields
    }
    studentMissionMasteryList {
      ...CMStudentFields
    }
  }
}

fragment CMMissionFields on Mission {
  name
  description
}

fragment CMStudentFields on StudentMissionMastery {
  student {
    lastName
    firstName
    email
    team
  }
  currentTaskId
  currentTaskName
  level
  progress
}
```
