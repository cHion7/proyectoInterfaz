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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function subirEvento(eventsArr) {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      console.warn("No hay usuario autenticado. No se pueden guardar eventos.");
      return false;
    }

    const uid = user.email.replace(/[@.]/g, "_");
    const eventosRef = ref(db, "Usuarios/" + uid + "/eventos");

    // Eliminar todos los eventos existentes antes de guardar nuevos
    eventsArr.forEach(entry => {
      if (Array.isArray(entry.events)) {
        entry.events.forEach(event => {
          if (event.key) {
            const eventRef = ref(db, `Usuarios/${uid}/eventos/${event.key}`);
            set(eventRef, null); // Eliminar evento existente
          }
        });
      }
    });

    // Guardar nuevos eventos
    eventsArr.forEach(entry => {
      if (Array.isArray(entry.events)) {
        entry.events.forEach(event => {
          const newRef = push(eventosRef);
          const key = newRef.key;
          
          // Crear copia del evento con la nueva clave
          const eventoActualizado = {
            ...event,
            key: key,
            fechaMillis: event.fechaMillis || new Date(entry.year, entry.month - 1, entry.day).getTime()
          };

          set(newRef, eventoActualizado)
            .then(() => console.log("Evento guardado:", eventoActualizado))
            .catch(error => console.error("Error al guardar:", error));
        });
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error en subirEvento:", error);
    return false;
  }
}

async function recibirTodasFechas() {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      console.warn("No hay usuario autenticado. No se pueden cargar eventos.");
      return [];
    }

    const uid = user.email.replace(/[@.]/g, "_"); // También podrías usar encodeURIComponent(user.email)
    const eventosRef = ref(db, "Usuarios/" + uid + "/eventos");
    const snapshot = await get(eventosRef);

    if (!snapshot.exists()) return [];

    const eventosObj = snapshot.val();
    const eventosArray = Object.values(eventosObj).filter(evento => evento && evento.fechaMillis);

    const eventosAgrupados = new Map();

    for (const evento of eventosArray) {
      const fecha = new Date(evento.fechaMillis);

      if (isNaN(fecha.getTime())) {
        console.warn("Evento con fechaMillis inválida:", evento);
        continue;
      }

      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      const clave = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

      if (!eventosAgrupados.has(clave)) {
        eventosAgrupados.set(clave, {
          day: dia,
          month: mes,
          year: anio,
          events: []
        });
      }

      eventosAgrupados.get(clave).events.push(evento);
    }


    return Array.from(eventosAgrupados.values()).sort((a, b) => {
      const d1 = new Date(a.year, a.month - 1, a.day);
      const d2 = new Date(b.year, b.month - 1, b.day);
      return d1 - d2;
    });

  } catch (error) {
    console.error("Error en recibirTodasFechas:", error);
    return [];
  }
}


window.firebaseCalendario = {
    recibirTodasFechas,
    subirEvento
};