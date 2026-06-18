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

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBOP8KfO5PFW00jJktzq8tVki1D8GJ6gos",
  authDomain:"smart-habit-tracker-97d8a.firebaseapp.com",
  projectId: "smart-habit-tracker-97d8a",
  storageBucket: "smart-habit-tracker-97d8a.appspot.com",
  messagingSenderId: "296749594638",
  appId: "1:296749594638:web:01ab748abd2d975426245f"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase loaded");

window.addEventListener("DOMContentLoaded", () => {

  // ================= SIGNUP =================
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
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful");
        window.location.href = "./dashboard.html";
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // ================= LOGIN =================
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful");
        window.location.href = "./dashboard.html";
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // ================= SAVE HABITS =================
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
      }
    });
  }

});