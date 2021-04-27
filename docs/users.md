## Users

### API

-  Get User based on Current Access Token
-  Update User attributes such as firstName, lastName

### Examples

#### Get User

```
query {
  getUser{
    id
    role
  }
}
```

#### Update User

```
mutation {
  updateUser(
    userInput: {
      firstName: "Freddy",
      lastName: "Johnson"
    }
  ){
    firstName,
    lastName
  }
}
```
