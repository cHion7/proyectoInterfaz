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

