import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { addUserToCourseReservation } from "./booking";

function phoneToEmail(phone: string) {
  return `${phone}@g.com`;
}

export async function handleUserLogin(
  courseId: string,
  name: string,
  phone: string
) {
  const email = phoneToEmail(phone);
  const password = name + phone;

  try {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, { displayName: name });
        console.log("User created successfully:", user);
        return addUserToCourseReservation(courseId, user.uid, name);
      })
      .then((bookingResult) => {
        console.log(bookingResult);
        return bookingResult;
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("signInWithEmailAndPassword: " + user.displayName);
              return addUserToCourseReservation(courseId, user.uid, name);
            })
            .then((bookingResult) => {
              console.log(bookingResult);
            });
          return;
        }
        console.log("Error from handleUserLogin: " + error.code);
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
