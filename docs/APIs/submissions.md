# SubMissions

## APIs

* Add SubMission
* Query SubMission

## Examples

### Add SubMission

```text
mutation{
  addSubMission(subMission: {
    name: "Chemical Bonds 2"
    description: "SubMission that focuses on saturated hydrocarbons 2"
    missionId: "4c40b1d2a39"
    missionIndex: 2
  })
}
```

### Query Submission

```text
query {
  subMission(subMissionId){
    id
    name
    description
    missionContent{
      ... on Task{
        name
        requirements{
          description
        }
      }
    }
  }
}
```

