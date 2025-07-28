"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseToken = void 0;
// src/services/firebase.service.ts
const firebase_admin_1 = __importDefault(require("firebase-admin"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(require('../../firebase-service-account.json')),
    });
}
const verifyFirebaseToken = async (idToken) => {
    return await firebase_admin_1.default.auth().verifyIdToken(idToken);
};
exports.verifyFirebaseToken = verifyFirebaseToken;
