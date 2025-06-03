import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCi97vgUzaR-TXpFvmv5vMKG7cdm7vNhU",
  authDomain: "base-de-datos-del-tfg-1.firebaseapp.com",
  projectId: "base-de-datos-del-tfg-1",
  storageBucket: "base-de-datos-del-tfg-1.appspot.com",
  messagingSenderId: "322269238228",
  appId: "1:322269238228:android:90de023599f3f7f7157c41"
};
//--------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//--------------------------------------------------------------

document.getElementById("googleLogin").addEventListener("click", async (e) => {
  e.preventDefault();
  
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuario autenticado con Google:", user.email);
    window.location.href = "Inicio.html";
  } catch (error) {
    console.error("Error en login con Google:", error.message);
  }
});
//--------------------------------------------------------------

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Sesión iniciada con:", user.email);

    window.location.href = "Inicio.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    alert("Error al iniciar sesión: " + error.message);
  }
});
//--------------------------------------------------------------

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario ya autenticado:", user.email);

  } else {
    console.log("Nadie ha iniciado sesión");
  }
});
//--------------------------------------------------------------
