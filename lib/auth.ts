import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function phoneToEmail(phone: string) {
  return `${phone}@g.com`;
}

export async function handleUserLogin(name: string, phone: string) {
  const email = phoneToEmail(phone);
  const password = name + phone;

  try {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, { displayName: name });
        console.log("User created successfully:", user);
        return user;
      })
      .catch((error) => {
        console.log("Error from handleUserLogin: " + error);
      });
  } catch (e: any) {
    console.log("e.code Error from handleUserLogin -->", e.code);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User from handleUserLogin(Catch): " + user);
        return user;
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(
          "errorMessage from handleUserLogin(Catch): " + errorMessage
        );
      });
  }
}
