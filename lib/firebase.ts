import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const isFirebaseConfigValid = () => {
    return (
        firebaseConfig.apiKey && 
        firebaseConfig.projectId && 
        firebaseConfig.appId
    );
};

import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
    if (!isFirebaseConfigValid()) {
        console.error('Invalid Firebase configuration. Please check your environment variables.');
    } else {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log('Firebase initialized successfully');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

export { app, db };
