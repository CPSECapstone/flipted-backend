# flipted-backend

[Repo](https://github.com/CPSECapstone/flipted-backend.git)

## Setup

1. Clone the repo and install dependencies

```bash
# install dependencies
npm install -g serverless
npm install
```

2. Next, type in `serverless offline` and visit the url it generates on your local machine

3. Now you can start to play around with the **resolvers, typedefs, and queries** that our Apollo Server is working with (I use Postman to test queries).

## Development

### Resolvers

These will be the keywords that are waiting to be triggered. Our only resolver right now is for users.

#### Typedefs

Typedefs will define both Queries and the contents of any objects we return. This is where Graphql gets pretty powerful.

#### Queries

In the same constant, we define all of the Queries our Graphql server will handle and what it returns.

### Deployment

When you're ready, you can deploy or redeploy with `serverless deploy`. To specify the stage (dev/prod), use the following `serverless deploy --stage prod` or `serverless deploy --stage dev`.

```
# Debug locally
npm run debug

# Deploy to AWS
npm run deploy
```

### Code Linting

-  [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/docs/getting-started/linting/README.md)
-  [The future of TypeScript on ESLint](https://eslint.org/blog/2019/01/future-typescript-eslint)
