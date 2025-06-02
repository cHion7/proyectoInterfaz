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
//--------------------------------------------------------------

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

//--------------------------------------------------------------

document.getElementById("googleLogin").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("Usuario autenticado:", user.email);
      window.location.href = "Inicio.html";
    })
    .catch((error) => {
      console.error("Error en login con Google:", error.message);
      alert("Error: " + error.message);
    });
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





function enviarDatos() {
  const mensaje = document.getElementById("mensaje").value;

  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const referencia = db.ref("usuarios/" + uid + "/mensajes");

    // Enviamos el mensaje con una clave única
    referencia.push({
      texto: mensaje,
      timestamp: Date.now()
    });
    alert("Mensaje enviado!");
  } else {
    alert("Usuario no autenticado.");
  }
}
//--------------------------------------------------------------

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