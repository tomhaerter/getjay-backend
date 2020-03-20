wirvsvirus-backend

# Setup
Run 
```bash
yarn install
```
to install the dependencies.

## Environment
Sensitive data is stored in `.env`-files in a folder called `environments` in the root project.
Create a folder `environments` in the projct root and create the files `.env.test` and `.env.development` in this folder. Each of these files needs to have the following variables set:

- APP_PORT=[The port the api runs on]
- FIREBASE_API_KEY=[The api key for the firebase project. You should use different firbase projects for development, testing and production.]
- FIREBASE_AUTH_DOMAIN=[The auth domain for the firebase project. You should use different firbase projects for development, testing and production.]
- FIREBASE_DATABASE_URL=[The database url for the firebase project. You should use different firbase projects for development, testing and production.]
- FIREBASE_PROJECT_ID=[The project id for the firebase project. You should use different firbase projects for development, testing and production.]
- FIREBASE_STORAGE_BUCKET=[The storage bucket for the firebase project. You should use di fferent firbase projects for development, testing and production.]
- FIREBASE_MESSAGING_SENDER_ID=[The messaging sender id for the firebase project. You should use different firbase projects for development, testing and production.]
- FIREBASE_APP_ID=[The app id for the firebase project. You should use different firbase projects for development, testing and production.]
- GOOGLE_APPLICATION_CREDENTIALS=[Full path to json file with the credentials for the service account (see <https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk>)]>
You can look at the `.env.example` file in the examples `environments` folder for a template for environment files.

**Never ever store your environment files or the service account credenetial file in a git repository or upload it to any service.**

## Built With
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of Javascript
- [Node](https://nodejs.org/en/) - The javascript runtime environment
- [Express](http://expressjs.com/) - The web framework
- [TypeORM](https://typeorm.io/#/) - The object relational mapper
- [Jest](https://jestjs.io/) - The testing framework
- [Yarn](https://yarnpkg.com/) - Dependency management