// src/services/firebase.service.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../firebase-service-account.json')),
  });
}

export const verifyFirebaseToken = async (idToken: string) => {
  return await admin.auth().verifyIdToken(idToken);
};
