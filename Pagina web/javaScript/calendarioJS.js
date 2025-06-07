function initializeAppLogic() {
  getEvents()
    .then(() => {
      initCalendar();         // Mostrar el calendario con eventos cargados
      updateCurrentDate();    // Actualizar encabezado con la fecha actual
      actualizarCategorias(); // Inicializar categorías

      const tipoEventoInputs = document.querySelectorAll('input[name="event-type"]');
      if (tipoEventoInputs.length === 0) {
        console.warn("No se encontraron inputs con name='event-type'");
      }

      tipoEventoInputs.forEach(input => {
        input.addEventListener("change", actualizarCategorias);
      });
    })
    .catch(error => {
      console.error("Error durante la inicialización de la lógica de la app:", error);
    });
}

// Ejecutar al cargar el DOM
window.addEventListener("DOMContentLoaded", initializeAppLogic);


const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector("#event-title"),
  addEventDescription = document.querySelector("#event-description"),
  addEventAmount = document.querySelector("#event-amount"),
  addEventType = document.querySelector("#event-type"),
  addEventCategory = document.querySelector("#event-category"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let eventsArr = []; // Array para almacenar eventos

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function updateCurrentDate() {
  const currentDateEl = document.getElementById("current-date");
  if (currentDateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = today.toLocaleDateString('es-ES', options);
  }
}

// Función para cargar eventos desde Firebase
// Función para cargar eventos desde Firebase y agruparlos por día
async function getEvents() {
  try {
    if (!(window.firebaseCalendario && typeof window.firebaseCalendario.recibirTodasFechas === "function")) {
      console.error("Funciones de Firebase no disponibles");
      eventsArr = [];
      return;
    }

    // 1) Obtener array “plano” de eventos
    const raw = await window.firebaseCalendario.recibirTodasFechas();
    if (!Array.isArray(raw)) {
      console.warn("recibirTodasFechas no devolvió un array:", raw);
      eventsArr = [];
      return;
    }

    // 2) Agrupar en un diccionario { "día-mes-año": [evento, ...] }
    const grouped = raw.reduce((acc, ev) => {
      const d = new Date(ev.fechaMillis);
      const day = d.getDate();
      const month = d.getMonth() + 1; // enero = 0 → +1
      const year = d.getFullYear();
      const key = `${day}-${month}-${year}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        titulo:    ev.titulo,
        descripcion: ev.descripcion,
        dinero:    ev.dinero,
        cobroOGasto: ev.cobroOGasto,
        categoria: ev.categoria,
        fechaMillis: ev.fechaMillis
      });
      return acc;
    }, {});

    // 3) Reconstruir eventsArr en el formato esperado por initCalendar()
    eventsArr = Object.entries(grouped).map(([key, events]) => {
      const [day, month, year] = key.split("-").map(Number);
      return { day, month, year, events };
    });

    console.log("Eventos cargados y agrupados:", eventsArr);

  } catch (error) {
    console.error("Error al cargar eventos:", error);
    eventsArr = [];
  }
}
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  // Días del mes anterior
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Días del mes actual
  for (let i = 1; i <= lastDate; i++) {
    const hasEvent = eventsArr.some(event => 
      event.day === i && 
      event.month === month + 1 && 
      event.year === year
    );

    const isToday = i === today.getDate() && 
                    year === today.getFullYear() && 
                    month === today.getMonth();

    if (isToday) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (hasEvent) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (hasEvent) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  // Días del próximo mes
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach(day => {
    day.addEventListener("click", e => {
      const selectedDay = Number(e.target.textContent);
      getActiveDay(selectedDay);
      updateEvents(selectedDay);
      activeDay = selectedDay;

      // Remover clase active de todos los días
      days.forEach(d => d.classList.remove("active"));
      
      // Añadir clase active al día seleccionado
      e.target.classList.add("active");

      // Manejar clic en días de meses anteriores/siguientes
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const daysAfterChange = document.querySelectorAll(".day");
          daysAfterChange.forEach(d => {
            if (d.textContent === e.target.textContent && 
                !d.classList.contains("next-date")) {
              d.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const daysAfterChange = document.querySelectorAll(".day");
          daysAfterChange.forEach(d => {
            if (d.textContent === e.target.textContent && 
                !d.classList.contains("next-date")) {
              d.classList.add("active");
            }
          });
        }, 100);
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toLocaleDateString("es-ES", { weekday: 'long' });
  eventDay.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  eventDate.innerHTML = `${date} ${months[month]} ${year}`;
}

//function update events when a day is active
function updateEvents(date) {
  let eventsHTML = "";
  const eventsForDay = eventsArr.find(
    event => event.day === date && 
             event.month === month + 1 && 
             event.year === year
  );

  if (eventsForDay && eventsForDay.events.length > 0) {
    eventsForDay.events.forEach(event => {
      const isIncome = event.cobroOGasto === "COBRO";
      eventsHTML += `
        <div class="event ${isIncome ? 'income' : 'expense'}">
          <div class="title">
            <i class="fas fa-circle" style="color: ${isIncome ? '#27ae60' : '#e74c3c'}"></i>
            <h3 class="event-title">${event.titulo}</h3>
          </div>
          <div class="event-details">
            <div class="event-detail">
              <span class="label">Categoría</span>
              <span class="value">${event.categoria}</span>
            </div>
            <div class="event-detail">
              <span class="label">Tipo</span>
              <span class="value">${event.cobroOGasto}</span>
            </div>
            <div class="event-detail">
              <span class="label">Descripción</span>
              <span class="value">${event.descripcion}</span>
            </div>
          </div>
          <div class="event-money">${event.dinero}</div>
        </div>
      `;
    });
  } else {
    eventsHTML = `<div class="no-event"><h3>No hay eventos</h3></div>`;
  }

  eventsContainer.innerHTML = eventsHTML;
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
  cancelarEvento();
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
    cancelarEvento();
  }
});

//allow 60 chars in eventtitle
addEventTitle.addEventListener("input", () => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

// Eliminar evento
eventsContainer.addEventListener("click", async (e) => {
  // Asegurarnos de que se hace clic en el contenedor del evento, no en un hijo
  let eventElement = e.target.closest('.event');
  if (!eventElement) return;

  if (confirm("¿Seguro que quieres borrar el evento?")) {
    const eventTitle = eventElement.querySelector('.event-title').textContent;
    
    // Buscar el día activo en eventsArr
    const dayEvents = eventsArr.find(event => 
      event.day === activeDay && 
      event.month === month + 1 && 
      event.year === year
    );
    
    if (dayEvents) {
      // Encontrar el índice del evento dentro del día
      const eventIndex = dayEvents.events.findIndex(ev => ev.titulo === eventTitle);
      if (eventIndex !== -1) {
        dayEvents.events.splice(eventIndex, 1);
        
        // Si no quedan eventos en el día, eliminar el día
        if (dayEvents.events.length === 0) {
          const dayIndex = eventsArr.indexOf(dayEvents);
          eventsArr.splice(dayIndex, 1);
          // Quitar clase 'event' del día activo
          const activeDayEl = document.querySelector(".day.active");
          if (activeDayEl && activeDayEl.classList.contains("event")) {
            activeDayEl.classList.remove("event");
          }
        }
        
        // Guardar en Firebase
        const success = await saveEvents();
        if (success) {
          updateEvents(activeDay);
        } else {
          alert("Error al eliminar el evento. Inténtalo de nuevo.");
        }
      }
    }
  }
});

//function to save events in firebase
async function saveEvents() {
  try {
    if (window.firebaseCalendario && typeof window.firebaseCalendario.subirEvento === "function") {
      await window.firebaseCalendario.subirEvento(eventsArr);
      console.log("Eventos guardados en Firebase");
      return true;
    } else {
      console.error("Funciones de Firebase no disponibles");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar eventos:", error);
    return false;
  }
}

function actualizarCategorias() {
  const categoriasGastos = [
    "Vivienda", "Transporte", "Alimentacion", "Salud", "Educacion",
    "Ocio", "Ropa y Calzado", "Seguros", "Impuestos y Tasas", "Otros"
  ];

  const categoriasCobros = [
    "Salario", "Ingresos Extras", "Inversiones", "Ventas", "Rentas",
    "Prestaciones y Subsidios", "Devoluciones", "Premios - Lotería", "Regalos - Donaciones"
  ];

  const tipoSeleccionado = document.querySelector('input[name="event-type"]:checked');
  if (!tipoSeleccionado) return;

  const tipo = tipoSeleccionado.value;
  const select = document.getElementById("event-category");
  
  if (!select) return;

  // Limpiar y poblar categorías
  select.innerHTML = "<option>Selecciona una categoría</option>";
  
  const categorias = tipo === "GASTO" ? categoriasGastos : categoriasCobros;
  
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

addEventSubmit.addEventListener("click", guardarEvento);

async function guardarEvento() {
  const titulo = addEventTitle.value.trim();
  const descripcion = addEventDescription.value.trim();
  const dinero = addEventAmount.value.trim();
  const tipoRadio = document.querySelector('input[name="event-type"]:checked');
  const tipo = tipoRadio ? tipoRadio.value : null;
  const categoria = addEventCategory.value;

  if (!titulo || !dinero || !tipo || categoria === "Selecciona una categoría") {
    alert("Por favor complete todos los campos");
    return;
  }

  const nuevoEvento = {
    titulo,
    descripcion,
    dinero: dinero + "€",
    cobroOGasto: tipo,
    categoria,
    fechaMillis: new Date(year, month, activeDay).getTime()
  };

  // Buscar si ya existe un registro para este día
  const existingDay = eventsArr.find(e => 
    e.day === activeDay && 
    e.month === month + 1 && 
    e.year === year
  );

  if (existingDay) {
    existingDay.events.push(nuevoEvento);
  } else {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [nuevoEvento]
    });
  }

  // Guardar en Firebase
  const success = await saveEvents();
  
  if (success) {
    // Actualizar UI
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventDescription.value = "";
    addEventAmount.value = "";
    addEventCategory.value = "Selecciona una categoría";
    
    updateEvents(activeDay);
    
    // Marcar día con evento
    const activeDayEl = document.querySelector(".day.active");
    if (activeDayEl && !activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }
  } else {
    alert("Error al guardar el evento en Firebase");
  }
}

// Cancelar evento
function cancelarEvento() {
  addEventTitle.value = '';
  addEventDescription.value = '';
  addEventAmount.value = '';
  
  // Restablecer el tipo a GASTO
  const gastoRadio = document.querySelector('input[name="event-type"][value="GASTO"]');
  if (gastoRadio) {
    gastoRadio.checked = true;
  }
  
  actualizarCategorias();
}