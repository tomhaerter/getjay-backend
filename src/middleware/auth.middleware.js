import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://wirvsvirus-eb4f2.firebaseio.com"
});

export default function firebaseAuthMiddleware(req, res, next) {
    const authorization = req.header('Authorization');
    if (authorization) {
        let authToken = authorization.split(' ');
        try {
            let decodedToken = await admin.auth().verifyIdToken(authToken[1]);
            res.firebaseUser = decodedToken;
            next();
        } catch(err) {
            log(error);
            res.sendStatus(401, {
                accessDenied: true,
                message: 'User needs to be logged in to access this resource.',
                cause: 'NOT AUTHENTICATED'
            });
        }
    } else {
        log('Authorization header not found');
        res.sendStatus(401, {
            accessDenied: true,
            message: 'Full authentication is required to access this resource.',
            cause: 'NOT AUTHENTICATED',
        });
    }
}