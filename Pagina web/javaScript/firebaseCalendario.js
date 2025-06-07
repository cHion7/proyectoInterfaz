import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


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


function subirEvento(event) {
  const user = auth.currentUser;

  if (event != null && user) {
    const uid = user.email.split(/[@.]/).join("_");

    // Generar una nueva referencia con clave automática
    const newEventRef = push(ref(db, "Usuarios/" + uid + "/eventos"));
    const key = newEventRef.key;

    // Incluir la clave dentro del objeto evento
    const eventWithKey = { ...event, key: key };

    // Subir el evento con la clave incluida
    set(newEventRef, eventWithKey)
      .then(() => {
        console.log("Evento guardado correctamente con key:", key);
      })
      .catch((error) => {
        console.log("Error al guardar datos:", error);
      });

  } else {
    console.warn("Usuario no autenticado o evento nulo. No se puede guardar.");
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


window.firebaseCalendario = {
    enviarFecha,
    recibirTodasFechas,
    subirEvento
};