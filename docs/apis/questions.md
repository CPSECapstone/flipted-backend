# Questions

## APIs

* Add Free Response Question
* Add Multiple Choice Question

## Examples

### Add Free Response Question

```text
mutation {
  addFrQuestion(
    question: {
      points: 2
      description: "A disturbance that transfers energy from place to place"
      answer: "Wave"
    }
  )
}
```

### Add Multiple Choice Question

```text
mutation {
  addMcQuestion(
    question: {
      points: 2
      description: "Ginger is a stem and not a root because"
      options: [
        "It lacks chlorophyll"
        "It stores food material"
        "It has notes and internodes"
        "It grows horizontally in the soil"
      ]
      answers: [3]
    }
  )
}
```

