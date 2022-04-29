import { initializeApp, getApps, FirebaseOptions, getApp, FirebaseApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { Auth, getAuth } from 'firebase/auth'

export const createFirebaseApp = () => {
  const clientCredentials: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  let app: FirebaseApp;
  if (getApps().length > 0) {
    app = getApp()
    return app
  }
  app = initializeApp(clientCredentials)
  // Check that `window` is in scope for the analytics module!
  if (typeof window !== 'undefined') {
    // Enable analytics. https://firebase.google.com/docs/analytics/get-started
    if ('measurementId' in clientCredentials) {
      getAnalytics()
    }
  }
  return app
}

export const auth: Auth = getAuth(createFirebaseApp())
