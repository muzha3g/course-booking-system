import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(
  __dirname,
  "../time-reservation-system-firebase-adminsdk-fbsvc-423fb6196a.json"
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

initializeApp({
  credential: cert(serviceAccount),
});

const adminUid = "";

async function setAdminClaim() {
  try {
    await getAuth().setCustomUserClaims(adminUid, { isAdmin: true });
    console.log(`Success on setting admin claim : ${adminUid}`);
  } catch (error) {
    console.error("Failed on  setting admin claim：", error);
  }
}

setAdminClaim();
