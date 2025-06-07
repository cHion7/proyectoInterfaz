/**async function cargarFechas() {
  console.log("Verificando window.firebaseCalendario:", window.firebaseCalendario);
  if (typeof window.firebaseCalendario.recibirTodasFechas === "function") {
    try {
      const datosFechas = await window.firebaseCalendario.recibirTodasFechas();
      console.log("Datos recibidos:", datosFechas);
      // Aquí puedes procesar los datos recibidos
    } catch (error) {
      console.error("Error al cargar las fechas:", error);
    }
  } else {
    console.error("window.firebaseCalendario o su función recibirTodasFechas no están definidos.");
  }
  console.log("Script JavaScript iniciado!");
}

window.onload = cargarFechas;
*/

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

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Novienbre",
  "Dicienbre",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
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

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
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

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
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

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});


//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.titulo}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.cobroOGasto}</span>
            </div>
              <div class="event-time">
              <span class="event-time">${event.dinero}</span>
            </div>
              <div class="event-time">
              <span class="event-time">${event.descripcion}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No hay eventos</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents(); //save events in local storage
}


//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});



//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//cambir porque espara añadir evento----------------------------------------------------------
function guardarBtn() {
  console.log("entra")
  const eventTitle = addEventTitle.value;
  const eventDescription = addEventDescription.value;//cambiar dato
  const eventAmount = addEventAmount.value;//cambiar dato
  const eventType = addEventType.value;//cambiar dato
  const eventCategory = addEventCategory.value;//cambiar dato

  if (eventTitle === "" || eventDescription === "" || eventAmount === "" || eventType === "" || eventCategory === "") {//cambiar dato
    alert("Porfavor rellena todos los campos");
    return;
  }


  const newEvent = {
    titulo: eventTitle,
    descripcion: eventDescription, //cambiar dato
    dinero: eventAmount, //cambiar dato
    cobroOGasto: eventType, //cambiar dato
    categoria: eventCategory, //cambiar dato
    fechaMillis: new Date(year, month, activeDay).getTime() //cambiar dato
  };

  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventDescription.value = "";//cambiar dato
  addEventAmount.value = "";//cambiar dato
  addEventType.value = "Selecciona un tipo"; //cambiar dato
  addEventCategory.value = "Selecciona una categoría"; //cambiar dato

  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
};
//------------------------------------------------------------------------------------------------
//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Seguro quieres borrar el evento?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  console.log("Contenido de eventsArr:", eventsArr);
  if (window.firebaseCalendario && typeof window.firebaseCalendario.subirEvento === "function") {
    window.firebaseCalendario.subirEvento(eventsArr); //--------------------------------------------------------------------------------
    console.log("Datos enviados correctamente");
  } else {
    console.log("No se pudo enviar los datos: función no disponible");
  }
}


//function to get events from local storage
async function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  //if (localStorage.getItem("events") === null) {
  //  return;
  //}
  if (window.firebaseCalendario && typeof window.firebaseCalendario.recibirTodasFechas === "function") {
    try {
      const eventos = await window.firebaseCalendario.recibirTodasFechas(); //--------------------------------------------------------------------------------
      mostrarToast("fechas recibidas correctamente", "success");
      if (Array.isArray(eventos)) {
        eventsArr.push(...eventos);
      }
    } catch (error) {
      mostrarToast("Error al obtener los datos: " + error, "error");
    }
  } else {
    mostrarToast("No se pudo enviar los datos: función no disponible", "error");
  }
  //eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

//-----------------------------------------------------------------------
function actualizarCategorias() {
  const categoriasGastos = [
    "Vivienda", "Transporte", "Alimentacion", "Salud", "Educacion",
    "Ocio", "Ropa y Calzado", "Seguros", "Impuestos y Tasas", "Otros"
  ];

  const categoriasCobros = [
    "Salario", "Ingresos Extras", "Inversiones", "Ventas", "Rentas",
    "Prestaciones y Subsidios", "Devoluciones", "Premios - Lotería", "Regalos - Donaciones"
  ];
  console.log("Ejecutando actualizarCategorias");
  const tipoSeleccionado = document.querySelector('input[name="event-type"]:checked');
  if (!tipoSeleccionado) return;

  const tipo = tipoSeleccionado.value;
  const select = document.getElementById("event-category");
  if (!select) return;

  select.innerHTML = "<option>Selecciona una categoría</option>";

  const categorias = tipo === "GASTO" ? categoriasGastos : categoriasCobros;
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarCategorias();

  document.querySelectorAll('input[name="event-type"]').forEach(input => {
    input.addEventListener("change", actualizarCategorias);
  });
});

// Guardar evento
function guardarEvento() {
  const tipo = document.querySelector('input[name="event-type"]:checked').value;
  const categoria = document.getElementById('event-category').value;
  const titulo = document.getElementById('event-title').value;
  const descripcion = document.getElementById('event-description').value;
  const cantidad = document.getElementById('event-amount').value;

  // Validación básica
  if (!titulo || !cantidad || categoria === "" || categoria === "Selecciona una categoría") {
    alert("Por favor, complete todos los campos obligatorios");
    return;
  }

  // Mostrar mensaje de éxito
  const successMessage = document.getElementById('success-message');
  successMessage.style.display = 'block';

  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 3000);

  // Aquí iría la lógica para guardar en base de datos
  console.log("Evento guardado:", { tipo, categoria, titulo, descripcion, cantidad });
}

// Cancelar evento
function cancelarEvento() {
  document.getElementById('event-title').value = '';
  document.getElementById('event-description').value = '';
  document.getElementById('event-amount').value = '';
  document.getElementById('gasto').checked = true;
  actualizarCategorias();
  actualizarPrevisualizacion();
}

//----------------------------------------------------------------------------------------------------------------------






































