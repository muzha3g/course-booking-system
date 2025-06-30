import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY!
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

export default auth;
