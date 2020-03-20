
import * as firebaseAdmin from "firebase-admin";
import * as express from 'express';

declare global {
  module Express {
    export interface Request {
        firebaseUser?: firebaseAdmin.auth.DecodedIdToken;
    }
  }
}