import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, push, set, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDCi97vgUzaR-TXpFvmv5vMKG7cdm7vNhU",
  authDomain: "base-de-datos-del-tfg-1.firebaseapp.com",
  projectId: "base-de-datos-del-tfg-1",
  storageBucket: "base-de-datos-del-tfg-1.appspot.com",
  messagingSenderId: "322269238228",
  appId: "1:322269238228:android:90de023599f3f7f7157c41",
  databaseURL: "https://base-de-datos-del-tfg-1-default-rtdb.europe-west1.firebasedatabase.app"
};
//--------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function enviarDatos(datosGuardar) {
  const user = auth.currentUser;
  if (datosGuardar != null) {
    const uid = user.email.split(/[@.]/).join("_");
    console.log(uid)
    remove(ref(db, "Usuarios/" + uid + "/datos/"))
      .catch((error) => {
        console.error("Esta ya vacio:", error);
      });
    datosGuardar.forEach((item) => {
      for (let clave in item) {
        const valor = item[clave];
        console.log("Guardando", clave, ":", valor);
        set(ref(db, "Usuarios/" + uid + "/datos/" + clave), valor)
          .catch((error) => {
            console.error("Error al guardar datos:", error);
          });
      }
    });
  } else {
    console.log("eorororoeoeooeeohjbijhdshjisdbnhjisdjbnhisadbnhjisdanhjiasdjinashdiasnjdu")
  }
}

window.transferenciaDeDatos = {
  enviarDatos
};



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