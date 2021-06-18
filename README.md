# flipted-backend

The `flipted-backend` project is a part of the senior capstone project for CSC 405/406 class. The capstone project is to build a LMS (learning management system) for K-12, which features in mastery learning and gamification.

The backend is built with `Typescript`, `Apollo GraphQL Server` and `Amazon Dynamo DB`. It is deployed as `Amazon Lambda Function` through `serverless` framework.

### Development

Please see `docs` folder for more on how to start developing the project. See [more](https://zzheng07.gitbook.io/flipted-backend/how-to-guide/getting_started)

To have our own development environments, we need to do deploy to different service stacks. .env.development and .env.production is not in the repo, as they will be different on each one's machine. However, we still need them locally. Here an example.

// .env.development
PROVIDER_STAGE="dev-zzheng07"
DATABASE_STAGE="dev"
AUTHORIZOR_STAGE="dev"

### License

`flipted-backend` project is licensed under the [MIT Licence](https://opensource.org/licenses/mit-license.php). See the [LICENSE](LICENSE).
