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
    course: "Integrated Science"
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
        missionId
        missionIndex
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
  missions(course: "Integrated Science"){
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
        missionId
      }
    }
  }
}
```
