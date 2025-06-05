import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, push, set, remove, update, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


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



//-------------------------------------------------------------------------------------------------
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


function enviarPerfil(perfilGuardar) {
  const user = auth.currentUser;
  console.log("llega")
  if (perfilGuardar != null) {
    console.log("entra")
    const uid = user.email.split(/[@.]/).join("_");
    perfilGuardar.forEach((item) => {
      for (let clave in item) {
        const valor = item[clave];
        console.log("Guardando", clave, ":", valor);
        remove(ref(db, "Usuarios/" + uid + "/" + clave));
        set(ref(db, "Usuarios/" + uid + "/" + clave), valor)
          .catch((error) => {
            console.error("Error al guardar datos:", error);
          });
      }
    });
  } else {
    console.log("erffrfhrhcfdhfhdhcdhhjdu")
  }
}

//------------------------------------------------------------------------------------------------------------------

async function recibirDatosPerfil() {
  const user = auth.currentUser;
  const uid = user.email.split(/[@.]/).join("_");
  console.log(uid);

  try {
    const nombreSnap = await get(ref(db, "Usuarios/" + uid + "/nombre"));
    const telefonoSnap = await get(ref(db, "Usuarios/" + uid + "/telefono"));

    const nombre = nombreSnap.exists() ? nombreSnap.val() : "";
    const telefono = telefonoSnap.exists() ? telefonoSnap.val() : "";

    return { nombre, telefono };
  } catch (error) {
    console.error("Error al recibir datos del perfil:", error);
    return { nombre: "", telefono: "" };
  }
}

async function recibirDatos() {
  const user = auth.currentUser;
  const uid = user.email.split(/[@.]/).join("_");
  console.log(uid);

  try {
    const datosSnap = await get(ref(db, "Usuarios/" + uid + "/datos/"));
    const datos = datosSnap.exists() ? datosSnap.val() : {};
    return datos;
  } catch (error) {
    console.error("Error al recibir datos:", error);
    return {};
  }
}



window.transferenciaDeDatos = {
  enviarDatos,
  enviarPerfil,
  recibirDatosPerfil,
  recibirDatos
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