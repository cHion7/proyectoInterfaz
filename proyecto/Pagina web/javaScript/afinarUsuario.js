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

function segundaFase() {
  const encontrate = document.getElementById("encontrate").value;
  mostrarCuadro("ajustesCuadro" + encontrate);
}


const combo = document.getElementById('encontrate');
combo.addEventListener('change', (event) => {
  const valorSeleccionado = event.target.value;
  mostrarCuadro("ajustesCuadro" + valorSeleccionado);
});


let activo = false
function modCampos() {
  const nombre = document.querySelector("#nombres");
  const situacion = document.querySelector("#situacion");
  const button = document.querySelector("#cambiarDatos");
  if (!activo) {
    button.style.backgroundColor = "green";
    activo = true
    nombre.disabled = false;
    situacion.disabled = false;
    button.textContent = "guardar cambios"

  } else {
    button.style.backgroundColor = "blue";
    activo = false
    nombre.disabled = true;
    situacion.disabled = true;
    button.innerHTML = `
    Cambiar datos 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
    </svg>
    `;
  }
}


function enviarCuestionario() {
  const notificacion = document.createElement("div");
  let datos = [];


  if (!lineIngresoBasic.value || !lineEdadBasic.value || !lineAcargoBasic.value || (!radioViviendaTrueBasic.checked && !radioViviendaFalseBasic.checked)) {
    mostrarToast("Faltan preguntas comunes por completar", "error");
    return;
  }


  const eleecion = comboSituacionBasic.value;
  const ingresoBruto = lineIngresoBasic.value;
  const edad = lineEdadBasic.value;
  const personasACargo = lineAcargoBasic.value;
  const vivienda = radioViviendaTrueBasic.checked ? true : false;


  if (eleecion === "Autonomo") {
    if (!dateAltaAutonomo.value || !lineActividadAutonomo.value || !lineGastosAutonomo.value || !lineIvaSuportAutonomo.value || !lineIvaRepertAutonomo.value || (!radiovehiculoTrueAutonomo.checked && !radiovehiculoFalseAutonomo.checked)) {
      mostrarToast("Faltan preguntas específicas de Autónomo por completar", "error");
      return;
    }
    datos.push({
      fechaAlta: dateAltaAutonomo.value,
      actividad: lineActividadAutonomo.value,
      gastosDeducibles: lineGastosAutonomo.value,
      ivaSoportado: lineIvaSuportAutonomo.value,
      ivaRepercutido: lineIvaRepertAutonomo.value,
      vehiculo: radiovehiculoTrueAutonomo.checked ? true : false
    });
  } else if (eleecion === "Asalariado") {
    if (!comboTipoJobAsalariado.value || (!radioFamiliaTrueAsalariado.checked && !radioFamiliaFalseAsalariado.checked) || !lineArrayEdadesAsalariado.value || !lineGastosAsalariado.value) {
      mostrarToast("Faltan preguntas específicas de Asalariado por completar", "error");
      return;
    }
    datos.push({
      tipoContrato: comboTipoJobAsalariado.value,
      familiaNumerosa: radioFamiliaTrueAsalariado.checked ? true : false,
      edadesHijos: lineArrayEdadesAsalariado.value,
      gastosEscolares: lineGastosAsalariado.value
    });
  } else if (eleecion === "Estudiante") {
    if (!comboEstudiosEstudiante.value || (!radioTrabajoTrueEstudiante.checked && !radioTrabajoFalseEstudiante.checked) || !lineBecaEstudiante.value) {
      mostrarToast("Faltan preguntas específicas de Estudiante por completar", "error");
      return;
    }
    datos.push({
      tipoEstudios: comboEstudiosEstudiante.value,
      trabaja: radioTrabajoTrueEstudiante.checked ? true : false,
      becaCantidad: lineBecaEstudiante.value
    });
  } else if (eleecion === "Jubilado") {
    if (!linePensionJubilado.value || (!radioSegundaViviendaTrueJubilado.checked && !radioSegundaViviendaFalseJubilado.checked) || !lineGastosMedicosJubilado.value) {
      mostrarToast("Faltan preguntas específicas de Jubilado por completar", "error");
      return;
    }
    datos.push({
      pensionAnual: linePensionJubilado.value,
      segundaVivienda: radioSegundaViviendaTrueJubilado.checked ? true : false,
      gastosMedicos: lineGastosMedicosJubilado.value
    });
  } else if (eleecion === "Empresario") {
    if (!comboTipoContratoEmpresario.value || !lineFacturacionEmpresario.value || !lineSueldoAdministradorEmpresario.value || !lineEmpleadosEmpresario.value || !lineGastosDeduciblesEmpresario.value) {
      mostrarToast("Faltan preguntas específicas de Empresario por completar", "error");
      return;
    }
    datos.push({
      tipoContrato: comboTipoContratoEmpresario.value,
      facturacionEmpresa: lineFacturacionEmpresario.value,
      sueldoAdministrador: lineSueldoAdministradorEmpresario.value,
      empleados: lineEmpleadosEmpresario.value,
      gastosDeduciblesEmpresa: lineGastosDeduciblesEmpresario.value
    });
  }


  deshabilitarCampos();


  mostrarToast("Formulario enviado correctamente", "success");

  // añadirFirebase(datos);
} function mostrarToast(mensaje, tipo) {
  const notificacion = document.createElement("div");
  notificacion.classList.add("toast");
  notificacion.classList.add(tipo === "success" ? "toast-success" : "toast-error");
  notificacion.innerHTML = mensaje;
  toasts.appendChild(notificacion);

  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}


function deshabilitarCampos() {
  const campos = document.querySelectorAll("input, select");
  campos.forEach(campo => {
    campo.disabled = true;
  });
}


function reiniciarCuestionario() {

  const campos = document.querySelectorAll("input, select");
  campos.forEach(campo => {
    campo.disabled = false;
  });


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






const enviar = document.querySelector('.boton');
const toasts = document.getElementById('toasts');
// Preguntas comunes
const comboSituacionBasic = document.querySelector('#encontrate')
const lineIngresoBasic = document.querySelector('#ingresoBruto');
const lineEdadBasic = document.querySelector('#edad');
const lineAcargoBasic = document.querySelector('#personasACargo');
const radioViviendaTrueBasic = document.querySelector('#viviendaSi');
const radioViviendaFalseBasic = document.querySelector('#viviendaNo');

// Preguntas Autónomo
const dateAltaAutonomo = document.querySelector('#datetime');
const lineActividadAutonomo = document.querySelector('#actividadProfesional');
const lineGastosAutonomo = document.querySelector('#gastosDeducibles');
const lineIvaSuportAutonomo = document.querySelector('#ivaSoportado');
const lineIvaRepertAutonomo = document.querySelector('#ivaRepercutido');
const radiovehiculoTrueAutonomo = document.querySelector('#vehiculoSi');
const radiovehiculoFalseAutonomo = document.querySelector('#vehiculoNo');

// Preguntas Asalariado
const comboTipoJobAsalariado = document.querySelector('#tipoContrato');
const radioFamiliaTrueAsalariado = document.querySelector('#familiaNumerosaSi');
const radioFamiliaFalseAsalariado = document.querySelector('#familiaNumerosaNo');
const lineArrayEdadesAsalariado = document.querySelector('#edadesHijos');
const lineGastosAsalariado = document.querySelector('#gastosEscolares');

// Preguntas Estudiante
const comboEstudiosEstudiante = document.querySelector('#tipoEstudios');
const radioTrabajoTrueEstudiante = document.querySelector('#trabajoSi');
const radioTrabajoFalseEstudiante = document.querySelector('#trabajoNo');
const lineBecaEstudiante = document.querySelector('#becaCantidad');

// Preguntas Jubilado
const linePensionJubilado = document.querySelector('#pensionAnual');
const radioSegundaViviendaTrueJubilado = document.querySelector('#segundaViviendaSi');
const radioSegundaViviendaFalseJubilado = document.querySelector('#segundaViviendaNo');
const lineGastosMedicosJubilado = document.querySelector('#gastosMedicos');

// Preguntas Empresario
const comboTipoContratoEmpresario = document.querySelector('#tipoContrato');
const lineFacturacionEmpresario = document.querySelector('#facturacionEmpresa');
const lineSueldoAdministradorEmpresario = document.querySelector('#sueldoAdministrador');
const lineEmpleadosEmpresario = document.querySelector('#empleados');
const lineGastosDeduciblesEmpresario = document.querySelector('#gastosDeduciblesEmpresa');