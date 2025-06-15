import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
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
  const password = process.env.NEXT_PUBLIC_PASSWORD;

  try {
    //  // Case 1 : new user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password!
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });
    console.log("User created successfully:", user);

    const bookingResult = await addUserToCourseReservation(
      courseId,
      user.uid,
      name
    );
    return bookingResult;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      try {
        // Case 2 : if user's phone number already exist
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password!
        );
        const user = userCredential.user;

        // Case 2-1 : user give different name in authenticated phone's number
        // change display name to new name
        await updateProfile(user, { displayName: name });

        const bookingResult = await addUserToCourseReservation(
          courseId,
          user.uid,
          name
        );
        return bookingResult;
      } catch (signInError: any) {
        console.error("Sign-in failed:", signInError.code);
        throw signInError;
      }
    } else {
      console.error("User creation failed:", error.code);
      throw error;
    }
  }
}

export async function handleUserLoginToSearchBooking(phone: string) {
  const email = phoneToEmail(phone);
  const password = process.env.NEXT_PUBLIC_PASSWORD;

  try {
    const userData = await signInWithEmailAndPassword(auth, email, password!);
    return userData.user.uid;
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      return "This phone number hasn't book any courses.";
    }
    return error.code;
  }
}

export function logout() {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.error(error);
    });
}
