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




function enviarFecha(fechaGuardar) { // se añade una fecha con sus datos y id unico
    const user = auth.currentUser;
    if (fechaGuardar != null) {
        const uid = user.email.split(/[@.]/).join("_");
        console.log(uid)
        fechaGuardar.forEach((item) => {
            for (let clave in item) {
                const valor = item[clave];
                console.log("Guardando", clave, ":", valor);
                const newEventRef = push(ref(db, "Usuarios/" + uid + "/eventos")); // genera id automático
                const key = newEventRef.key; // obtiene el id automático
                set(newEventRef, { id: key, [clave]: valor })
                    .catch((error) => {
                        console.error("Error al guardar datos:", error);
                    });
            }
        });
    } else {
        console.log("eorororoeoeooeeohjbijhdshjisdbnhjisdjbnhisadbnhjisdanhjiasdjinashdiasnjdu")
    }
}

//---------------------------------------------------

async function recibirTodasFechas() { //se supone que coje todas las fechas
    console.log("entra")
    const user = auth.currentUser;
    const uid = user.email.split(/[@.]/).join("_");
    console.log(uid);
    
    try {
        const datosSnap = await get(ref(db,"Usuarios/" + uid + "/eventos"));
        const datos = datosSnap.exists() ? datosSnap.val() : {};
        return datos;
    } catch (error) {
        console.error("Error al recibir datos:", error);
        return {};
    }
}



function borrarFecha(perfilGuardar) {
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

window.firebaseCalendario = {
    enviarFecha,
    recibirTodasFechas,
    borrarFecha
};