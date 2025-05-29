// Mostrar el cuadro correspondiente según la situación seleccionada
function mostrarCuadro(idCuadroActivo) {
  const cuadros = document.querySelectorAll(".ajustes-cuadro");
  cuadros.forEach(cuadro => {
    cuadro.classList.remove("activo");
  });

  const cuadroActivo = document.getElementById(idCuadroActivo);
  if (cuadroActivo) {
    cuadroActivo.classList.add("activo");
  }
}

// Cambiar a la segunda fase del cuestionario
function segundaFase() {
  const encontrate = document.getElementById("encontrate").value;
  mostrarCuadro("ajustesCuadro" + encontrate);
}

o


// Mostrar un toast de notificación
function mostrarToast(mensaje, tipo) {
  const notificacion = document.createElement("div");
  notificacion.classList.add("toast");
  notificacion.classList.add(tipo === "success" ? "toast-success" : "toast-error");
  notificacion.innerHTML = mensaje;
  toasts.appendChild(notificacion);

  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Deshabilitar todos los campos del formulario
function deshabilitarCampos() {
  const campos = document.querySelectorAll("input, select");
  campos.forEach(campo => {
    campo.disabled = true;
  });
}

// Reiniciar el cuestionario
function reiniciarCuestionario() {
  cuestionario = false;

  // Habilitar todos los campos del formulario
  const campos = document.querySelectorAll("input, select");
  campos.forEach(campo => {
    campo.disabled = false;
  });

  // Limpiar los valores de los campos
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    if (input.type === "radio" || input.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });

  const selects = document.querySelectorAll("select");
  selects.forEach(select => {
    select.selectedIndex = 0;
  });

  mostrarToast("Cuestionario reiniciado", "success");
}