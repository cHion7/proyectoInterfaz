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
  if (!user) {
    console.warn("No hay usuario autenticado.");
    return;
  }

  const uid = user.email.replace(/[@.]/g, "_");
  const eventosRef = ref(db, "Usuarios/" + uid + "/eventos");

  eventsArr.forEach(entry => {
    if (Array.isArray(entry.events)) {
      entry.events.forEach(event => {
        const newRef = push(eventosRef);  // crea clave única
        const key = newRef.key;

        // Sumar un día (en milisegundos) a fechaMillis si existe
        let eventoConKey = { ...event, key: key };
        if (eventoConKey.fechaMillis) {
          eventoConKey.fechaMillis = eventoConKey.fechaMillis + 24 * 60 * 60 * 1000;
        }

        // ✅ Mostrar en consola el evento justo antes de subirlo
        console.log("Evento que se va a subir:", eventoConKey);

        set(newRef, eventoConKey)
          .then(() => {
            console.log("Evento subido correctamente:", eventoConKey);
          })
          .catch(error => {
            console.error("Error al subir evento:", error);
          });
      });
    }
  });
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
    recibirTodasFechas,
    subirEvento
};