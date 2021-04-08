## SubMissions

### APIs

+ Add SubMission
+ Get SubMission By Id
+ List SubMissions By MissionId

### Examples

```
mutation {
  addSubMission(
    subMission: {
      missionId: "mission 1"
      objectiveId: "objective 1"
      name: "sub-mission 1"
      description: "sub-mission 1 description"
    }
  )
}
```

```
query {
  subMissions(missionId) {
    id
    name
    description
    missionId
    objectiveId
  }
}
```
