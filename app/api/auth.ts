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
  // const password = name + phone;
  const password = "default";

  try {
    // new user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser!, { displayName: name });
        console.log("User created successfully:", user);
        return addUserToCourseReservation(courseId, user.uid, name);
      })
      .then((bookingResult) => {
        console.log(bookingResult);
        return bookingResult;
      })
      .catch((error) => {
        // if user already in Authentication DB
        if (error.code === "auth/email-already-in-use") {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              updateProfile(auth.currentUser!, { displayName: name });
              console.log("User changed display name: ", user.displayName);
              console.log(
                "signInWithEmailAndPassword Name: " + user.displayName
              );
              return addUserToCourseReservation(courseId, user.uid, name);
            })
            .then((bookingResult) => {
              console.log(bookingResult);
            })
            .catch((error) => {
              console.log("signInWithEmailAndPassword(Catch): " + error.code);
            });

          return;
        } else if (error.code === "auth/invalid-credential") {
          console.log("auth/invalid-credential: " + error.code);
        }
        console.log("Error from handleUserLogin: " + error.code);
      });
  } catch (e: any) {
    console.log("Error from handleUserLogin(Catch): ", e.code);
    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     const user = userCredential.user;
    //     console.log("User from handleUserLogin(Catch): " + user);
    //     return user;
    //   })
    //   .catch((error) => {
    //     const errorMessage = error.message;
    //     console.log(
    //       "errorMessage from handleUserLogin(Catch): " + errorMessage
    //     );
    //   });
  }
}
