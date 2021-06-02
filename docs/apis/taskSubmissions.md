# Task Submissions

## APIs

* Query Task Submission Summaries By Course

## Examples

### Query Task Submission Summaries By Course

```graphql
query {
   taskSubmissionSummaries(course: "Integrated Science") {
      studentId
      studentName
      taskId
      taskName
      graded
      pointsPossible
      pointsAwarded
      teacherComment
   }
}
```
