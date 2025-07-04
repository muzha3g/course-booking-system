import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { addUserToCourseReservation } from "./booking";
import { deleteCookie, setCookie } from "cookies-next";

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
    // Case 1 : new user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password!
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

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

export async function handleAdminLogin(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = (await userCredential.user.getIdTokenResult()).token;
  setCookie("firebase_token", token);

  return userCredential;
}

export function logout() {
  signOut(auth)
    .then(() => {
      deleteCookie("firebase_token");
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.error(error);
    });
}

export function subscribeToAuthChanges(callback: any) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  return unsubscribe;
}
