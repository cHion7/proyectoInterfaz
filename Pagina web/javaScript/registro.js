import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDCi97vgUzaR-TXpFvmv5vMKG7cdm7vNhU",
    authDomain: "base-de-datos-del-tfg-1.firebaseapp.com",
    projectId: "base-de-datos-del-tfg-1",
    storageBucket: "base-de-datos-del-tfg-1.appspot.com",
    messagingSenderId: "322269238228",
    appId: "1:322269238228:android:90de023599f3f7f7157c41",
    databaseURL: "https://base-de-datos-del-tfg-1-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("contrasana").value;
    const passwordConfirm = document.getElementById("confirmContrsena").value;

    if (password !== passwordConfirm) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    try {
        // Crear usuario con el correo real
        await createUserWithEmailAndPassword(auth, correo, password);
        
        // Usar correoMod como ID para la base de datos
        const correoMod = correo.split(/[@.]/).join("_");
        await set(ref(db, "Usuarios/" + correoMod), {
            nombre: nombre,
            correo: correo
        });

        alert("Usuario registrado con éxito.");
        window.location.href = "inicioSesion.html";
    } catch (error) {
        console.error("Error al registrarte:", error.message);
        alert("Error al registrarte: " + error.message);
    }
});
