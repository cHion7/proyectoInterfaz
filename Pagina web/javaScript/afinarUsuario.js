
function segundaFase() {
  const encontrate = document.getElementById("encontrate").value;
  mostrarCuadro("ajustesCuadro" + encontrate);
  
}


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
