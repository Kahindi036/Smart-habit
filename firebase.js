// ===============================
// 1. IMPORTS
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ===============================
// 2. FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBOP8KfO5PFW00jJktzq8tVki1D8GJ6gos",
  authDomain: "smart-habit-tracker-97d8a.firebaseapp.com",
  projectId: "smart-habit-tracker-97d8a",
  storageBucket: "smart-habit-tracker-97d8a.appspot.com",
  messagingSenderId: "296749594638",
  appId: "1:296749594638:web:01ab748abd2d975426245f"
};


// ===============================
// 3. INITIALIZE FIREBASE
// ===============================
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  console.log("Current user:", user);
});

console.log("Firebase connected successfully");

window.addEventListener("DOMContentLoaded", () => {

// ===============================
// 4. SIGN UP LOGIC
// ===============================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Signup successful");
      console.log(userCredential.user);

      // Redirect to dashboard or perform other actions
      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
}


// ===============================
// 5. LOGIN LOGIC
// ===============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful");
      console.log(userCredential.user);

      // Redirect to dashboard or perform other actions
      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
}

function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁️";
  }
}


// ===============================
// 6. SAVE HABITS (FIRESTORE)
// ===============================
  const saveButton = document.getElementById("saveHabit");

if (saveButton) {
  saveButton.addEventListener("click", async () => {
    alert("Button clicked!");

    const habitInput = document.getElementById("habitInput").value;

    if (!habitInput) {
      alert("Please enter a habit");
      return;
    }

    try {
      await addDoc(collection(db, "habits"), {
        habit: habitInput,
        createdAt: new Date()
      });

      alert("Habit saved successfully");

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
}