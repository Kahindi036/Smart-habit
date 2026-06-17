window.completeHabit = null;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey:  "AIzaSyBOP8KfO5PFW00jJktzq8tVki1D8GJ6gos",
  authDomain: "smart-habit-tracker-97d8a.firebaseapp.com",
  projectId: "smart-habit-tracker-97d8a",
  appId: "1:296749594638:web:01ab748abd2d975426245f"
};

// 🔹 INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Firebase imports here
// Auth setup here

// =====================
// STEP 1: ASK PERMISSION
// =====================
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }
}

// Run it when dashboard loads
requestNotificationPermission();

sendReminder("Test", "This is working!");

// =====================
// NOTIFICATIONS SECTION
// =====================

function sendReminder(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "habit.jpg"
    });
  }
}

// =======================
// AUTH CHECK (ONLY ONE)
// =======================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    loadHabits(user.uid);
  } else {
    console.log("No user detected - redirecting");
    window.location.href = "login.html";
  }
});
// =======================
// LOGOUT
// =======================
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// =======================
// ADD HABIT
// =======================
window.addHabit = async function () {
  const input = document.getElementById("habitInput");
  const text = input.value.trim();

  if (!text) return;

  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in");
    return;
  }

  await addDoc(collection(db, "habits"), {
    name: text,
    uid: user.uid,
    completed : false,
    streak: 0,
    lastCompletedDate: null,
    createdAt: Date.now()
  });

  input.value = "";
  loadHabits(user.uid);
};

// =======================
// LOAD HABITS
// =======================
async function loadHabits(uid) {
  const q = query(collection(db, "habits"), where("uid", "==", uid));

  const snapshot = await getDocs(q);

  const list = document.getElementById("habitList");
  list.innerHTML = "";
  const habits = [];

snapshot.forEach((docSnap) => {
  const data = docSnap.data();
  const id = docSnap.id;
  habits.push(data);

    const div = document.createElement("div");
    div.classList.add("habit");

    div.innerHTML = `
  <span>${data.name}</span>
  <button onclick="completeHabit('${id}')">
    ${data.completed ? "Done ✔" : "Complete"}
  </button>
`;

if (data.completed) {
  div.style.textDecoration = "line-through";
}

    list.appendChild(div);
  });

  updateTotalHabits();
  updateProgress(habits);
  updateCompletedToday(habits);
}

// =======================
// COMPLETE HABIT
// =======================
// 
window.completeHabit = async function (id) {
  console.log("🔥 CLICKED COMPLETE BUTTON:", id);

  try {
    const habitRef = doc(db, "habits", id);

    const snapshot = await getDoc(habitRef);

    if (!snapshot.exists()) {
      console.log("❌ Habit not found in Firestore");
      return;
    }

    const data = snapshot.data();

    const today = getToday();
    const last = data.lastCompletedDate;

    let newStreak = data.streak || 0;

    if (last === today) {
      console.log("⚠ Already completed today");
      return;
    }

    if (last) {
      const diffTime =
        new Date(today) - new Date(last);

      const diffDays =
        diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await updateDoc(habitRef, {
      completed: true,
      streak: newStreak,
      lastCompletedDate: today
    });

    console.log("✅ Firestore updated successfully");

    const user = auth.currentUser;
    loadHabits(user.uid);

  } catch (error) {
    console.error("❌ ERROR in completeHabit:", error);
  }
};

// =======================
// COUNTERS
// =======================
function updateTotalHabits() {
  const total = document.querySelectorAll(".habit").length;
  document.getElementById("totalHabits").innerText = total;
}

function updateCompleted() {
  const completed = document.querySelectorAll(".habit button:disabled").length;
  document.getElementById("completedHabits").innerText = completed;
}
function getToday() {
  return new Date().toISOString().split("T")[0];
}

function updateProgress(habits) {

    const totalHabits = habits.length;

    const completedHabits = habits.filter(
        habit => habit.completed === true
    ).length;

    let percentage = 0;

    if (totalHabits > 0) {
        percentage =
            Math.round(
                (completedHabits / totalHabits) * 100
            );
    }

    document.getElementById("progressBar").value =
        percentage;

    document.getElementById("progressText").textContent =
        percentage + "%";
}
function isCompletedToday(habit) {
  return habit.lastCompletedDate === getToday();
}
function updateCompletedToday(habits) {
  const today = getToday();

  const completedToday = habits.filter(
    habit => habit.lastCompletedDate === today
  ).length;

  document.getElementById("completedHabits").innerText = completedToday;
}
window.scrollToProgress = function () {
    document
        .getElementById("progressBar")
        .scrollIntoView({ behavior: "smooth" });
        function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }
}

requestNotificationPermission();
document.getElementById("enableNotifBtn").addEventListener("click", async () => {
  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);
});
document.getElementById("enableNotifBtn").onclick = () => {
  alert("Button works!");
};
}
