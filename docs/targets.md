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
      name: "TE 1"
      description: " Target 1 Description"
      subject: "Science"
      gradeLevel: 6
      icon: ""
      standards: ""
      course: "Integrated Science"
    }
  )
}
```

#### Get Target

```graphql
query GetTarget {
  target(course: "Integrated Science", targetId: "3ea0ef40e4c") {
    targetId
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

#### List Targets By Course

```graphql
query ListTargetsByCourse {
  targets(course: "Integrated Science") {
    targetId
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
