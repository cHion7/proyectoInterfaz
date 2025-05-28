function calcularLinea() {
  quitarGraficos();

  let capitalInicial = parseFloat(document.getElementById('capital').value) || 0;
  const plazoPrestamo = parseInt(document.getElementById('plazoPrestamo').value) || 1;
  const tipoInteres = parseFloat(document.getElementById('tipoInteres').value) || 0;

  const i = tipoInteres / 100;
  const anualidad = (capitalInicial * i) / (1 - Math.pow(1 + i, -plazoPrestamo));

  const interesesArray = [];
  const capitalAcumuladoArray = [];
  const capitalPendienteArray = [];

  let capitalPendiente = capitalInicial;
  let capitalAcumulado = 0;
  let totalIntereses = 0;

  for (let año = 0; año < plazoPrestamo; año++) {
    const interesAnual = capitalPendiente * i;
    const cuotaAmortizacion = anualidad - interesAnual;
    capitalPendiente -= cuotaAmortizacion;
    capitalAcumulado += cuotaAmortizacion;
    totalIntereses += interesAnual;

    interesesArray.push(interesAnual);
    capitalAcumuladoArray.push(capitalAcumulado);
    capitalPendienteArray.push(Math.max(capitalPendiente, 0));
  }

  resultados.innerHTML = `
    <p><strong>Anualidad:</strong> €${anualidad.toFixed(2)}</p>
    <p><strong>Total intereses:</strong> €${totalIntereses.toFixed(2)}</p>
    <p><strong>Cuota anual aproximada:</strong> €${anualidad.toFixed(2)}</p>
  `;

  const labels = Array.from({ length: plazoPrestamo }, (_, i) => `Año ${i + 1}`);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Intereses',
        data: interesesArray,
        fill: false,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1
      },
      {
        label: 'Capital acumulado',
        data: capitalAcumuladoArray,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'Capital pendiente',
        data: capitalPendienteArray,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };


  const ctx = document.getElementById('graficoBarra').getContext('2d');
  if (chart) {
    chart.destroy();
    chart = null;
  }
  chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Evolución del Capital Restante' }
      }
    }
  });

  // Mostrar tabla si el checkbox está activado
  if (graficoPrestamo) graficoPrestamo.style.display = 'flex';
  if (checkbox) {
    genera_tabla(plazoPrestamo, anualidad, interesesArray, capitalAcumuladoArray, capitalPendienteArray);
  }
}


function genera_tabla(anos, interes, cuotamensual, capitalRestante, interesPost, anioCambio, cuotaMensualConImpuestoPost) {
  const body = document.getElementById("creacionDeTabla");
  const tablasExistentes = document.querySelectorAll("table");
  tablasExistentes.forEach(tabla => tabla.remove());

  const datosPrincipales = ["Años", "Interés", "Cuota sin interés", "Capital pendiente"];

  const tabla = document.createElement("table");
  const tblHead = document.createElement("thead");
  const tblBody = document.createElement("tbody");

  const hileraCabecera = document.createElement("tr");
  datosPrincipales.forEach(dato => {
    const celda = document.createElement("th");
    const textoCelda = document.createTextNode(dato);
    celda.appendChild(textoCelda);
    hileraCabecera.appendChild(celda);
  });
  tblHead.appendChild(hileraCabecera);

  for (let i = 0; i < anos; i++) {
    const hilera = document.createElement("tr");

    const celdaAnio = document.createElement("td");
    const textoAnio = document.createTextNode(`Año ${i + 1}`);
    celdaAnio.appendChild(textoAnio);
    hilera.appendChild(celdaAnio);

    const celdaInteres = document.createElement("td");
    const textoInteres = document.createTextNode(i < anioCambio ? interes : interesPost);
    celdaInteres.appendChild(textoInteres);
    hilera.appendChild(celdaInteres);

    const celdaCuota = document.createElement("td");
    const textoCuota = document.createTextNode(cuotamensual);
    celdaCuota.appendChild(textoCuota);
    hilera.appendChild(celdaCuota);

    const celdaCapital = document.createElement("td");
    const textoCapital = document.createTextNode(capitalRestante);
    celdaCapital.appendChild(textoCapital);
    hilera.appendChild(celdaCapital);

    if (i < anioCambio) {
      capitalRestante -= cuotamensual * 12;
    } else {
      capitalRestante -= cuotaMensualConImpuestoPost * 12;
    }

    tblBody.appendChild(hilera);
  }

  tabla.appendChild(tblHead);
  tabla.appendChild(tblBody);

  tabla.style.borderCollapse = "collapse";
  tabla.style.width = "80%";
  tabla.style.margin = "20px auto";
  tabla.style.border = "1px solid #ddd";
  tabla.querySelectorAll("th, td").forEach(cell => {
    cell.style.border = "1px solid #ddd";
    cell.style.padding = "8px";
    cell.style.textAlign = "center";
  });

  body.appendChild(tabla);
}



function calcularLinea() {
  quitarGraficos();
  const capitalInicial = parseFloat(document.getElementById('capital').value) || 0;
  const plazoPrestamo = parseInt(document.getElementById('plazoPrestamo').value) || 1;
  const tipoInteres = parseFloat(document.getElementById('tipoInteres').value) || 0;

  const checkbox = document.getElementById('checkbox').checked;

  const interesPost = parseFloat(document.getElementById('interesPost').value) || 0;
  const anioCambio = parseInt(document.getElementById('anioCambio').value) || 0;

  const cuotaMensual = (capitalInicial * tipoInteres / 100) / 12;
  const totalIntereses = cuotaMensual * plazoPrestamo * 12 - capitalInicial;
  const totalPagar = cuotaMensual * plazoPrestamo * 12 + capitalInicial;
  const cuotaMensualConImpuesto = cuotaMensual * (1 + tipoInteres / 100);
  const cuotaMensualConImpuestoPost = cuotaMensual * (1 + interesPost / 100);
  resultados.innerHTML = `
    <p><strong>Cuota mensual:</strong> €${cuotaMensual.toFixed(2)}</p>
    <p><strong>Total intereses:</strong> €${totalIntereses.toFixed(2)}</p>
    <p><strong>Cuota mensual con impuesto:</strong> €${cuotaMensualConImpuesto.toFixed(2)}</p>
  `;

  const labels = Array.from({ length: plazoPrestamo }, (_, i) => `Año ${i + 1}`);
  let capitalRestante = capitalInicial;
  const listaDeLineasCapital = [];
  for (let i = 1; i <= plazoPrestamo; i++) {
    if (checkbox && i >= anioCambio) {
      capitalRestante -= cuotaMensualConImpuestoPost * 12;

    } else {
      capitalRestante -= cuotaMensualConImpuesto * 12;
    }
    listaDeLineasCapital.push(Math.max(capitalRestante, 0));
  }

  let capitalRestanteSinInteres = totalPagar;
  const listaDeLineasCapitalSin = [];
  for (let i = 1; i <= plazoPrestamo; i++) {
    capitalRestanteSinInteres -= cuotaMensual * 12;
    listaDeLineasCapitalSin.push(Math.max(capitalRestanteSinInteres, 0));
  }
  if (chart) {
    chart.destroy();
    chart = null;
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Capital restante con impuesto',
        data: listaDeLineasCapital,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Capital restante sin impuesto',
        data: listaDeLineasCapitalSin,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const graficoPrestamo = document.getElementById('graficoPrestamo');
  if (chart) {
    chart.destroy();
    chart = null;
  }
  const ctx = document.getElementById('graficoBarra').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Evolución del Capital Restante' }
      }
    }
  });
  if (graficoPrestamo) graficoPrestamo.style.display = 'flex';
  if (checkbox) {
    genera_tabla(plazoPrestamo, tipoInteres, cuotaMensual, totalPagar, interesPost, anioCambio, cuotaMensualConImpuestoPost);
  } else {
    genera_tabla(plazoPrestamo, tipoInteres, cuotaMensual, totalPagar, 0, 0, cuotaMensualConImpuestoPost);
  }

}
