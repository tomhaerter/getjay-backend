import express = require("express");
import * as firebaseAdmin from 'firebase-admin';
import * as firebase from 'firebase-client';
import { validateFirebaseIdToken } from "../../../src/middleware/auth.middleware";
import Firebase from "../../../src/services/firebase";

let firebaseClient: firebase.app.App;
let admin: firebaseAdmin.app.App;

describe("firebase auth middleware", () => {
  beforeAll(
    () => { 
      firebaseClient = Firebase.getInstance().client;
      admin = Firebase.getInstance().admin;
    }
  );
  it("should populate req.user with the payload of a decoded id token", async () => {
    const uid = '123456';
    const customToken = await admin.auth().createCustomToken(uid);
    const userCredential = await firebaseClient
      .auth()
      .signInWithCustomToken(customToken);
    const idToken = await userCredential.user.getIdToken();

    let req: any = {
        header: jest.fn().mockReturnValue(idToken),
    };
    const res: any = {};
    const next = jest.fn();

    await validateFirebaseIdToken(req, res, next);
    
    expect(req.user).toBeDefined();
    expect(req.user.uid).toBe(uid);
    expect(next).toHaveBeenCalled();
  });
});