import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import Firebase from '../services/firebase';


export async function validateFirebaseIdToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const userPayload = await Firebase.getInstance().admin.auth().verifyIdToken(token, true);
    req.firebaseUser = userPayload;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
    return;
  }
}