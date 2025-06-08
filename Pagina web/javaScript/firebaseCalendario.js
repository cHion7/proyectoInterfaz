import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Variable para controlar estado de autenticación
let isAuthReady = false;
let currentUser = null;

// Escuchar cambios de autenticación
onAuthStateChanged(auth, (user) => {
  isAuthReady = true;
  currentUser = user;
  console.log("Estado de autenticación actualizado:", user ? "Autenticado" : "No autenticado");
});

async function subirEvento(eventsArr) {
  if (!isAuthReady) {
    console.warn("Autenticación no está lista al intentar guardar");
    return false;
  }
  
  try {
    if (!currentUser || !currentUser.email) {
      console.warn("No hay usuario autenticado. No se pueden guardar eventos.");
      return false;
    }

    const uid = currentUser.email.replace(/[@.]/g, "_");
    const eventosRef = ref(db, "Usuarios/" + uid + "/eventos");

    // Primero obtener eventos existentes
    const snapshot = await get(eventosRef);
    const eventosExistentes = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    // Eliminar eventos existentes
    for (const key of eventosExistentes) {
      const eventRef = ref(db, `Usuarios/${uid}/eventos/${key}`);
      await set(eventRef, null);
    }

    // Guardar nuevos eventos
    for (const entry of eventsArr) {
      if (Array.isArray(entry.events)) {
        for (const event of entry.events) {
          const newEventRef = push(eventosRef);
          await set(newEventRef, {
            ...event,
            key: newEventRef.key
          });
        }
      }
    }
    
    console.log("Eventos guardados correctamente en Firebase");
    return true;
  } catch (error) {
    console.error("Error en subirEvento:", error);
    return false;
  }
}

async function recibirTodasFechas() {
  if (!isAuthReady) {
    console.warn("Autenticación no está lista al intentar cargar");
    return [];
  }
  
  try {
    if (!currentUser || !currentUser.email) {
      console.warn("No hay usuario autenticado. No se pueden cargar eventos.");
      return [];
    }

    const uid = currentUser.email.replace(/[@.]/g, "_");
    const eventosRef = ref(db, "Usuarios/" + uid + "/eventos");
    const snapshot = await get(eventosRef);

    if (!snapshot.exists()) return [];

    const eventosObj = snapshot.val();
    return Object.values(eventosObj).filter(evento => evento && evento.fechaMillis);
  } catch (error) {
    console.error("Error en recibirTodasFechas:", error);
    return [];
  }
}

window.firebaseCalendario = {
    recibirTodasFechas,
    subirEvento,
    isAuthReady: false // Se actualizará mediante el listener
};

// Actualizar el estado en el objeto global
setInterval(() => {
  window.firebaseCalendario.isAuthReady = isAuthReady;
}, 500);