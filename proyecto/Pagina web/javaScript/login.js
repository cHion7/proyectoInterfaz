import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

document.getElementById("googleLogin").addEventListener("click", async () => {
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





function enviarDatos(datosGuardar) {
  const user = auth.currentUser;
  if (datosGuardar != null) {
    if (user) {
      const uid = user.uid;
      datosGuardar.forEach((item, index) => {

        for (let clave in item) {
          set(ref(db, "usuarios/" + uid + "/datos/" + clave), item[clave])
            .catch((error) => {
              console.error("Error al guardar datos:", error);
            });
        }
      });
    }
  } else {
    //Si es null borra todo 
  }
}
//--------------------------------------------------------------
/*
auth.signInWithEmailAndPassword("usuario@ejemplo.com", "contraseña123")
  .then(() => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const referencia = db.ref("usuarios/" + uid + "/mensajes");

      referencia.on("value", (snapshot) => {
        const lista = document.getElementById("listaMensajes");
        lista.innerHTML = ""; // Limpiar lista

        const datos = snapshot.val();
        for (let clave in datos) {
          const mensaje = datos[clave].texto;
          const item = document.createElement("li");
          item.textContent = mensaje;
          lista.appendChild(item);
        }
      });
    }
  })
  .catch((error) => {
    console.error("Error al autenticar:", error.message);
  });

//--------------------------------------------------------------

db.ref("usuarios/" + uid + "/mensajes").get().then(snapshot => {
  if (snapshot.exists()) {
    const datos = snapshot.val();
    // usar datos
  }
});

//--------------------------------------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "Inicio.html"; // ya está logueado, ir directamente
  }
});

*/