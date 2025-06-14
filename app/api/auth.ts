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
  const password = "default";

  try {
    // Case 1 : new user
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
        // Case 2 : if user's phone number already in Authentication DB
        if (error.code === "auth/email-already-in-use") {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;

              // user give different name in authenticated phone's number
              // change display name to new name
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
        }
      });
  } catch (error: any) {
    console.log("Error from handleUserLogin(Catch): ", error.code);
  }
}
