# Class Target Mastery

## APIS

* Query Class Target Mastery By TargetId

## Examples

```graphql
query ClassTargetMastery {
  classTargetMastery(targetId: "3f88ed2c542") {
    target {
      ...CTMTargetField
    }
    studentObjectiveMasteryList {
      ...CTMStudentObjectiveMasteryFields
    }
  }
}

fragment CTMTargetField on Target {
  targetId
  targetName
  objectives {
    ...CTMObjectiveField
  }
}

fragment CTMObjectiveField on Objective {
  objectiveId
  objectiveName
}

fragment CTMStudentObjectiveMasteryFields on StudentObjectiveMastery {
  student {
    studentId
    email
  }
  objectiveMasteryList {
    ...CTMObjectiveMasteryFields
  }
}

fragment CTMObjectiveMasteryFields on ObjectiveMastery {
  objectiveId
  mastery
}
```
