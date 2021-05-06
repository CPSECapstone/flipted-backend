# Targets

## APIs

* Add Target
* Get Target By Target Id
* List Targets By Course

## Examples

### Add  Target

```graphql
mutation AddTarget {
  addTarget(
    target: {
      targetName: "TE"
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

### Get Target

```graphql
query GetTarget {
  target(targetId: "eaf7ce60c44") {
    targetId
    targetName
    description
    subject
    gradeLevel
    icon
    standards
    course
  }
}
```

### List Targets By Course

```graphql
query ListTargetsByCourse {
  targets(course: "Integrated Science") {
    targetId
    targetName
    description
    subject
    gradeLevel
    icon
    standards
    course
  }
}
```

