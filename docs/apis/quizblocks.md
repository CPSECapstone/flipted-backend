# Quiz Blocks

## APIs

* Add Quiz Block
* Get Quiz Block By Block Id

## Examples

### Add Free Response Question

```text
mutation {
  addQuizBlock(
    quizblock: {
      title: "Week 1 Quiz"
      requiredScore: 10
      points: 20
      questionIds: ["FR_QUESTION#c375b5a56f8", "MC_QUESTION#a9bfcb78e7d"]
    }
  )
}
```

### Get Quiz Block By Block Id

```text
query {
  quizblock(blockId: "d56778bc210"){
    points,
    blockId,
    requiredScore,
    questions{
      __typename
      ... on FrQuestion {
        id
        description
        points
        answer
      }
      ... on McQuestion {
        id
        description
        points
        answers
        options {
          id
          description
        }
      }
    }
  }
}
```

