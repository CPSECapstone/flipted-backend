## SubMissions

### APIs

- Add SubMission
- Query SubMission

### Examples

#### Add SubMission

```
mutation{
  addSubMission(subMission: {
    name: "Chemical Bonds 2"
    description: "SubMission that focuses on saturated hydrocarbons 2"
    parentMissionId: "4c40b1d2a39"
    parentMissionIndex: 2
  })
}
```

#### Query Submission

```
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
