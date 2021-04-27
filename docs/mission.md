## Missions

### APIs

-  Add Mission
-  Query Mission
-  Query Missions By Course

### Examples

#### Add Mission

```
mutation {
  addMission(mission: {
    course: "0"
    name: "Chemical Bonds"
    description: "This mission will teach..."
  })
}
```

#### Query Mission

```
query {
  mission(missionId: "da0719ba103") {
    id
    course
    name
    description
    missionContent{
      ... on Task{
        id
        name
        parentMissionId
        parentMissionIndex
        pages{
          blocks{
            title
            ... on TextBlock{
              contents
            }
            ... on ImageBlock{
              imageUrl
            }
            ... on QuizBlock{
              title
              blockId
              questions {
                description
              }
            }
          }
        }
      }
      ... on SubMission{
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
	}
}
```

#### Query Mission By Course

```
query {
  missions(course: "0"){
    id
    course
    name
    missionContent{
      ... on Task{
        id
        name
      }
      ... on SubMission{
        id
        name
        parentMissionId
      }
    }
  }
}
```
