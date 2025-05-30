import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDCi97vgUzaR-TXpFvmv5vMKG7cdm7vNhU",
    authDomain: "base-de-datos-del-tfg-1.firebaseapp.com",
    projectId: "base-de-datos-del-tfg-1",
    storageBucket: "base-de-datos-del-tfg-1.appspot.com",
    messagingSenderId: "322269238228",
    appId: "1:322269238228:android:90de023599f3f7f7157c41"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escuchar evento submit del formulario login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Sesión iniciada con:", user.email);
    // Redirigir a la página principal después de login
    window.location.href = "Inicio.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    alert("Error al iniciar sesión: " + error.message);
  }
});

// Detectar si ya hay usuario autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario ya autenticado:", user.email);
    // Opcional: redirigir automáticamente si ya está logueado
    // window.location.href = "Inicio.html";
  } else {
    console.log("Nadie ha iniciado sesión");
  }
});





