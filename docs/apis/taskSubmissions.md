# Task Submissions

## APIs

* Query Task Submission Summaries By Course and Task Id

## Examples

### Query Task Submission Summaries By Course and Task Id

```graphql
query {
   taskSubmissionSummary(course: "Integrated Science", taskId: "90e0c730e56") {
      task {
         id
         name
         instructions
      }
      results {
         studentId
         studentName
         graded
         pointsAwarded
         teacherComment
      }
   }
}
```
