wirvsvirus-backend

# Setup
Run 
```bash
yarn install
```
to install the dependencies.

## Environment variables
Sensitive data is stored in `.env`-files in a folder called `environments` in the root project.
Create a folder `environments` in the projct root and create the files `.env.test` and `.env.development` in this folder. Each of these files needs to have the following variables set:
- `POSTGRES_HOST`=[The postgres host. For docker-compose, this is the service name.]
- `POSTGRES_PASSWORD`=[The password for the postgres database]
- `POSTGRES_USER`=[The database user]
- `POSTGRES_DB`=[The name of the database]
- `POSTGRES_PORT`=[The port on which the database server is listening]
- `POSTGRES_USE_SSL`=[true or false. If this is enabled, save the postgres certificate as postgres-ca.crt in the environments folder.]
- `FIREBASE_API_KEY`=[The API key for the firebase project.]
- `FIREBASE_AUTH_DOMAIN`=[The auth domain for the firebase project.]
- `FIREBASE_DATABASE_URL`=[The database url for the firebase project.]
- `FIREBASE_PROJECT_ID`=[The project id for the firebase project.]
- `FIREBASE_STORAGE_BUCKET`=[The storage bucket for the firebase project.]
- `FIREBASE_MESSAGING_SENDER_ID`=[The messaging sender id for the firebase project.]
- `FIREBASE_APP_ID`=[The app id for the firebase project.]
- `GOOGLE_APPLICATION_CREDENTIALS`=[Full path to json file with the credentials for the [service account](https://firebase.google.com/support/guides/service-accounts)]

You should use different firebase projects for development, testing and production.
You can look at the `.env.example` file in the examples `environments` folder for a template for environment files.

**Never store your environment files or the service account credenetial file in a git repository or upload it to any service.**

## Built With
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of Javascript
- [Node](https://nodejs.org/en/) - The javascript runtime environment
- [Express](http://expressjs.com/) - The web framework
- [TypeORM](https://typeorm.io/#/) - The object relational mapper
- [Jest](https://jestjs.io/) - The testing framework
- [Yarn](https://yarnpkg.com/) - Dependency management