import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY
);

initializeApp({
  credential: cert(serviceAccount),
});

async function setAdminClaim() {
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
  try {
    await getAuth().setCustomUserClaims(adminUid, { isAdmin: true });
    console.log(`Success on setting admin claim : ${adminUid}`);
  } catch (error) {
    console.error("Failed on  setting admin claim：", error);
  }
}

setAdminClaim();
