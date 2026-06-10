import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let completedCount = 0;
let totalHabits = 0;

// =======================
// LOAD HABITS
// =======================
async function loadHabits() {
  const habitList = document.getElementById("habitList");
  habitList.innerHTML = "";

  completedCount = 0;
  totalHabits = 0;

  const querySnapshot = await getDocs(collection(db, "habits"));

  querySnapshot.forEach((item) => {
    const data = item.data();

    totalHabits++;

    if (data.completed) {
      completedCount++;
    }

    const habitDiv = document.createElement("div");
    habitDiv.classList.add("habit");

    habitDiv.innerHTML = `
      <span>${data.habitName}</span>
      <div>
        <button onclick="completeHabit('${item.id}')">
          ${data.completed ? "Completed" : "Complete"}
        </button>

        <button onclick="deleteHabit('${item.id}')">Delete</button>
      </div>
    `;

    habitList.appendChild(habitDiv);
  });

  document.getElementById("totalHabits").innerHTML = totalHabits;
  document.getElementById("completedHabits").innerHTML = completedCount;
}

// =======================
// ADD HABIT
// =======================
async function addHabit() {
  const habitInput = document.getElementById("habitInput");
  const habitText = habitInput.value.trim();

  if (!habitText) {
    alert("Please enter a habit");
    return;
  }

  try {
    await addDoc(collection(db, "habits"), {
      habitName: habitText,
      completed: false,
      createdAt: new Date()
    });

    habitInput.value = "";
    loadHabits();

  } catch (error) {
    console.error(error);
  }
}

// =======================
// COMPLETE HABIT
// =======================
async function completeHabit(id) {
  try {
    await updateDoc(doc(db, "habits", id), {
      completed: true
    });

    loadHabits();

  } catch (error) {
    console.error(error);
  }
}

// =======================
// DELETE HABIT
// =======================
async function deleteHabit(id) {
  try {
    await deleteDoc(doc(db, "habits", id));
    loadHabits();
  } catch (error) {
    console.error(error);
  }
}

// =======================
// MAKE FUNCTIONS GLOBAL
// =======================
window.addHabit = addHabit;
window.completeHabit = completeHabit;
window.deleteHabit = deleteHabit;

// =======================
// START APP
// =======================
loadHabits();