## Data Interfaces and Schema

Data flow back and forth between front-end to back-end. One entity may have different forms at different stages. Here are some conventions.

### 1. `[EntityName]Input`

The entity input is extracted from client request. It is sufffixed with `Input`. This entity input should have the same attributes with the corresponding `input` object defined in `GraphQL`.
Example:

```
# src/interfaces/taskInterfaces.ts
export interface TaskInput {
  ...
}

# src/schema/tasks.graphql
input TaskInput {
  ...
}
```

### 2. `[EntityName]Item`

The entity item is the mapping to the item stored in the dynamodb. Whatever your `[EntityName]Item` looks like, it will be exactly the same in dynamodb. Usually, when we get `[EntityName]Input` from client request, we tranform the `Input` to a databse `Item`. One `Input` may generate one or multiple `Item`s.
Example:

```
# src/interfaces/taskInterfaces.ts
export interface TaskItem {
  ...
}

# One Row of Task Entity in Database
```

### 3. `[EntityName]`

An entity without any suffix is the final representation a client receives when they request to access this entity. The entity may be corresponding to one or multiple `Item`s in database. The entity should also have the same attributes with the corresponding `type` object defined in `GraphQl`.
