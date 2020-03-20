import * as firebaseAdmin from 'firebase-admin';
import * as firebase from 'firebase';
import { environmentVariables } from '../config/environment.config';

export default class Firebase {
  private _admin: firebaseAdmin.app.App;
  private _client: firebase.app.App;

  private static instance: Firebase = null;

  public get admin() {
    return this._admin;
  }

  public get client() {
    return this._client;
  }

  constructor() {
    this._admin = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.applicationDefault(),
      databaseURL: environmentVariables.firebaseDatabaseUrl
    });
    
    this._client = firebase.initializeApp({
      apiKey: environmentVariables.firebaseApiKey,
      authDomain: environmentVariables.firebaseAuthDomain,
      databaseURL: environmentVariables.firebaseDatabaseUrl,
      projectId: environmentVariables.firebaseProjectId,
      storageBucket: environmentVariables.firebaseStorageBucket,
      messagingSenderId: environmentVariables.firebaseMessagingSenderId,
      appId: environmentVariables.firebaseAppId
    });
  }

  static getInstance(): Firebase {
    if (Firebase.instance === null) {
      Firebase.instance = new Firebase();
    }

    return Firebase.instance;
  }
}