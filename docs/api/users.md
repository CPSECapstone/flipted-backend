# Users

## API

* Get User based on Current Access Token
* Update User attributes such as firstName, lastName

## Examples

### Get User

```text
query {
  getUser{
    id
    role
  }
}
```

### Update User

```text
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

