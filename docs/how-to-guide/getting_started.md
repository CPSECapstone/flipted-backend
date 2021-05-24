# Getting Started

## Setup

Clone the repo and install dependencies

[Repo](https://github.com/CPSECapstone/flipted-backend.git)

```bash
# install dependencies
npm install -g serverless
npm install
```

## Useful commands

### `npm run debug`

This is the command we use daily. Underlying, it runs `sls ofline` and `graphql-codegen` concurrently. Everytime a `typescript` file changes, the whole project will be recompiled with `webpack`. Everytime a `graphql` file changes, `graphql-codegen` will run to generate new version of `types.d.ts` file.

### `npm run test`

Run all the test files in the project with `jest`.

### `npm run generate`

This command is used to generate types files at `src/__generate__/types.d.ts`. Normally, when you conduct daily development, you don't want to manually run this command sperately, as this code generation is run automatically.

### `npm run deploy`

When you completed one feature or fix one bug, you can then push the change to the AWS lambda function service, and all teams will the new version of APIs.

## Development Workflow

1. Design Data Models
2. Define `GraphQL` schema, including type definitions and resolvers
3. Generate type definition file with `graphql-code-genertor` tool and implement resolvers.
4. Write tests
5. Deploy via Github Action
