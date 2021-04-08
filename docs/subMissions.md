## SubMissions

### APIs

- Add SubMission
- List SubMissions By MissionId

### Examples

#### Add SubMission

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

#### List SubMissions By MissionId

```
query {
  subMissions(missionId: "mission 1") {
    id
    name
    description
    missionId
    objectiveId
  }
}
```
