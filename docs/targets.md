## Learning Target

### APIs

-  Add Target
-  Get Target
-  List Targets By Course

### Examples

#### Add  Target

```graphql
mutation AddTarget {
  addTarget(
    target: {
      name: "TE"
      description: " Target 1 Description"
      subject: "Science"
      gradeLevel: 6
      icon: ""
      standards: ""
      courseName: "Integrated Science"
    }
  )
}
```

#### Get Target

```graphql
query GetTarget {
  target(courseName: "Integrated Science", targetName: "TE") {
    targetId
    name
    description
    subject
    gradeLevel
    icon
    standards
    courseName
  }
}
```

#### List Targets By Course

```graphql
query ListTargetsByCourse {
  targets(courseName: "Integrated Science") {
    targetId
    name
    description
    subject
    gradeLevel
    icon
    standards
    courseName
  }
}
```
