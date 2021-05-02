## Learning Target

### APIs

-  Add Learning Target
-  Get Learning Target By Id
-  List Learning Targets By Course

### Examples

#### Add Learning Target

```graphql
mutation AddLearningTarget {
  addLearningTarget(
    target: {
      name: "TE 1"
      description: "Learning Target 1 Description"
      subject: "Science"
      gradeLevel: 6
      icon: ""
      standards: ""
      course: "Integrated Science"
    }
  )
}
```

#### Get Learning Target By Id

```graphql
query GetLearningTargetById {
  learningTarget(targetId: "81ccd3ec8ff") {
    name
    description
    subject
    gradeLevel
    icon
    standards
    course
  }
}
```

#### List Learning Targets By Course

```graphql
query ListLearningTargetsByCourse {
  learningTargets(course: "Integrated Science") {
    name
    description
    subject
    gradeLevel
    icon
    standards
    course
  }
}
```
