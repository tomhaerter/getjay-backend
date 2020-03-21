
import * as firebaseAdmin from "firebase-admin";
import * as express from 'express';
import {User} from "../../database/entity/user";

declare global {
  module Express {
    export interface Request {
        firebaseUser?: firebaseAdmin.auth.DecodedIdToken;
        getUser?: () => Promise<User>
        jobOffer?: any;
    }
  }
}