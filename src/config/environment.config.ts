import {port, str, cleanEnv, num} from "envalid";

require("dotenv-flow").config({
  path: process.cwd() + "/environments/"
});

cleanEnv(process.env, {
//   APP_CERTIFICATE_PASSPHRASE: str(),

  POSTGRES_PASSWORD: str(),
  POSTGRES_HOST: str(),
  POSTGRES_USER: str(),
  POSTGRES_DB: str(),
  POSTGRES_PORT: port(),

  FIREBASE_API_KEY: str(),
  FIREBASE_AUTH_DOMAIN: str(),
  FIREBASE_DATABASE_URL: str(),
  FIREBASE_PROJECT_ID: str(),
  FIREBASE_STORAGE_BUCKET: str(),
  FIREBASE_MESSAGING_SENDER_ID: str(),
  FIREBASE_APP_ID: str(),

  APP_PORT: num()
});

export const environmentVariables = {
//   appCertificatePassphrase: process.env.APP_CERTIFICATE_PASSPHRASE,

  postgresHost: process.env.POSTGRES_HOST,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDb: process.env.POSTGRES_DB,
  postgresPort: process.env.POSTGRES_PORT,
  postgresUseSSL: process.env.POSTGRES_USE_SSL,

  firebaseApiKey: process.env.FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
  firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.FIREBASE_APP_ID,
  firebaseTestUser: process.env.FIREBASE_TEST_USER,
  firebaseTestUserPassword: process.env.FIREBASE_TEST_USER_PASSWORD,

  appPort: process.env.APP_PORT
};
