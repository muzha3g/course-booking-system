## About

This spring (2025), I went ice-skating at Taipei Arena and noticed their course booking rule: students must reserve by phone or at the counter. As someone who dislikes talking on the phone, I thought of "inline", a restaurant reservation platform that simplifies booking by only requiring basic personal details like name and cellphone number.

Inspired by "inline", I've developed a similar system for Taipei Arena. Users can now book courses for the next 14 days directly from a calendar by simply entering their name and phone number. They can also easily search for and cancel any of their single course bookings. For the arena's office, a specific account and password grant access to an admin dashboard, allowing them to manage coach data and view student bookings for each course.

---

## Features

### Student Features

- Book Courses
- Search Bookings
- Cancel Bookings

### Admin Features

- Coach Management
  - Create Coach Profiles
  - Edit Coach Profiles
  - Delete Coach Profiles
- Course Monitoring
  - View Student Bookings

---

## Usage

Follow these steps to get your project up and running:

1. **Firebase Project Setup:**
   - Create a new project in Firebase. Please refer to the [official Firebase documentation](https://firebase.google.com/docs/web/setup) for detailed instructions, then enable "Authentication" and "Cloud Firestore".
   - In Firebase Authentication, set up an admin account with an email and password. Remember these credentials, as they will be used to log in to the admin page of your application.
2. **Local Setup:**
   - Clone this repository:
   ```
   git clone https://github.com/muzha3g/course-booking-system.git
   ```
   - Navigate into the project directory.
   - Install dependencies:
   ```
   npm install
   ```
   - Start the development server:
   ```
   npm run dev
   ```

---

## Configuration

To connect your application to Firebase, you'll need to set up your environment variables:

1. Locate the `.env.sample` file in the root of your project.
2. Rename `.env.sample` to `.env`.
3. Paste your Firebase SDK configuration variables into the `.env` file. You can find these credentials in your Firebase project settings.

   Your `.env` file should look something like this:

   ```
   NEXT_PUBLIC_API_KEY=
   NEXT_PUBLIC_AUTH_DOMAIN=
   NEXT_PUBLIC_PROJECT_ID=
   NEXT_PUBLIC_STORAGE_BUCKET=
   NEXT_PUBLIC_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_APP_ID=
   NEXT_PUBLIC_PASSWORD="default" # You can change this value to whatever you want
   ```

---

## BTW

I'm currently busy with lab work, but I will implement the following feature soon:

- Admin Route Protection
- Deploy the repo
