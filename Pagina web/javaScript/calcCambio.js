const tabs = document.querySelectorAll('#tabs li');
const formulario = document.getElementById('formulario');
const resultados = document.getElementById('resultados');
let chart = null;

const contenido = {
  renta: {
    campos: `
      <label for="precio">Precio inmueble:</label><br>
      <input type="number" id="precio"><br><br>
      <label for="ahorro">Ahorro aportado:</label><br>
      <input type="number" id="ahorro"><br><br>
      <label for="plazo">Plazo préstamo:</label><br>
      <input type="number" id="plazo"><br><br>
      <label for="impuesto">Impuesto:</label><br>
      <input type="number" id="impuesto"><br><br>
      <button type="button" id="btnHipoteca">Calcular hipoteca</button>
    `,
    resultados: `
      <p><strong>Cuota mensual:</strong> €0.00</p>
      <p><strong>Importe hipoteca:</strong> €0.00</p>
      <p><strong>Porcentaje de financiacion:</strong> €0.00</p>
      <p><strong>Precio del inmueble:</strong> €0.00</p>
      <p><strong>Impuestos y gastos:</strong> €0.00</p>
      <p><strong>Ahorro aportado:</strong> €0.00</p>
      <p><strong>Importe hipoteca:</strong> €0.00</p>
      <p><strong>Interes hipoteca:</strong> €0.00</p>
      <p><strong>Coste total:</strong> €0.00</p>
    `
  },
  iva: {
    campos: `
      <label for="capital">Capital inicial:</label><br>
      <input type="number" id="capital"><br><br>
      <label for="plazoPrestamo">Plazo (años):</label><br>
      <input type="number" id="plazoPrestamo"><br><br>
      <label for="tipoInteres">Tipo interés (%):</label><br>
      <input type="number" id="tipoInteres"><br><br>
      <label for="checkbox">InteresPosterior?</label>
      <input type="checkbox" id="checkbox"><br><br>
      <label for="interesPost">Interés posterior:</label><br>
      <input type="number" id="interesPost"><br><br>
      <label for="anioCambio">Año de cambio de tipo:</label><br>
      <input type="number" id="anioCambio"><br><br>
      <button type="button" id="btnPrestamo">Calcular préstamo</button>
    `,
    resultados: `
      <p><strong>Mensualidad:</strong> €0.00</p>
      <p><strong>Mensualidad posterior:</strong> €0.00</p>
    `
  },
  autonomos: {
    campos: `
      <label>¿Cómo has ganado dinero?:</label><br>
      <label>Seleccione una opción:</label><br>
      <label for="opcion3">He vendido criptomonedas</label><br>
      <input type="radio" id="venta" name="vender" value="vender">

      <label for="cambio">He cambiado una criptomoneda por otra</label><br>
      <input type="radio" id="cambio" name="cambiar" value="cambiar">

      <label for="regalo">Me han regalado criptomonedas</label><br>
      <input type="radio" id="regalo" name="regalar" value="regalar">

      <label for="mineria">Hago minería de criptomonedas</label><br>
      <input type="radio" id="mineria" name="minar" value="minar">

      <label for="prestamo">Presto criptomonedas</label><br>
      <input type="radio" id="prestamo" name="prestar" value="prestar">

      <label for="ganancias">¿Cuánto dinero has ganado?:</label><br>

      <input type="text" id="ganancias"><br><br>
      <button type="button" id="btnAutonomo">Calcular</button>
    `,
    resultados: `
      <p><strong>(+)Tus ganancias:</strong> €0.00</p>
      <p><strong>(-)Tus perdidas:</strong> €0.00</p>
      <p><strong>(=)Después de impuestos:</strong> €0.00</p>
    `
  }
};

function mostrarGrafico(tabId) {
  const graficoHipoteca = document.getElementById('graficoHipoteca');
  const graficoPrestamo = document.getElementById('graficoPrestamo');
  if (graficoHipoteca) graficoHipoteca.style.display = 'none';
  if (graficoPrestamo) graficoPrestamo.style.display = 'none';

  if (chart) {
    chart.destroy();
    chart = null;
  }

  if (tabId === 'renta') {
    calcularPie();
  } else if (tabId === 'iva') {
    calcularLinea();
  } else if (tabId === 'autonomos') {
    calcularCripto();
  }
}

function calcularPie() {
  const precio = parseFloat(document.getElementById('precio').value) || 0;
  const ahorro = parseFloat(document.getElementById('ahorro').value) || 0;
  const plazo = parseInt(document.getElementById('plazo').value) || 1;
  const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;

  const gastos = precio * 0.10;
  const hipoteca = (precio + gastos) - ahorro;
  const interesAnual = impuesto / 100;
  const interesMensual = interesAnual / 12;
  const numeroCuotas = Math.floor(plazo * 12);

  const pow = Math.pow(1 + interesMensual, numeroCuotas);
  const cuotaMensualCalculada = hipoteca * ((interesMensual * pow) / (pow - 1));
  const cuotaMensualSinInteres = hipoteca / numeroCuotas;
  const cuotaMensualConImpuesto = cuotaMensualCalculada * (1 + impuesto / 100);

  const totalPagado = cuotaMensualCalculada * numeroCuotas;
  const interesesTotales = totalPagado - hipoteca;
  const costeTotal = precio + gastos + interesesTotales;

  resultados.innerHTML = `
    <p><strong>Cuota mensual:</strong> €${cuotaMensualCalculada.toFixed(2)}</p>
    <p><strong>Cuota mensual sin interés:</strong> €${cuotaMensualSinInteres.toFixed(2)}</p>
    <p><strong>Cuota mensual con impuesto:</strong> €${cuotaMensualConImpuesto.toFixed(2)}</p>
    <p><strong>Importe hipoteca:</strong> €${hipoteca.toFixed(2)}</p>
    <p><strong>Interés hipoteca:</strong> €${(interesesTotales / numeroCuotas).toFixed(2)}</p>
    <p><strong>Precio del inmueble:</strong> €${precio.toFixed(2)}</p>
    <p><strong>Impuestos y gastos:</strong> €${gastos.toFixed(2)}</p>
    <p><strong>Ahorro aportado:</strong> €${ahorro.toFixed(2)}</p>
    <p><strong>Coste total:</strong> €${costeTotal.toFixed(2)}</p>
  `;

  const graficoHipoteca = document.getElementById('graficoHipoteca');
  if (chart) {
    chart.destroy();
    chart = null;
  }
  const ctx = document.getElementById('graficoPie').getContext('2d');
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Ahorro aportado', 'Intereses', 'Precio del inmueble', 'Importe hipoteca'],
      datasets: [{
        data: [ahorro, interesesTotales, precio, hipoteca],
        backgroundColor: ['#4CAF50', '#FF5722', '#2196F3', '#FFC107']
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Distribución de Hipoteca'
        }
      }
    }
  });
  if (graficoHipoteca) graficoHipoteca.style.display = 'block';
}

function calcularLinea() {  //me falta usar el calculod de checkbox
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

  let capitalRestanteSinInteres = capitalInicial;
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
    const textoInteres = document.createTextNode(i < anioCambio ? interes.toFixed(2) : interesPost.toFixed(2));
    celdaInteres.appendChild(textoInteres);
    hilera.appendChild(celdaInteres);

    const celdaCuota = document.createElement("td");
    const textoCuota = document.createTextNode(cuotamensual.toFixed(2));
    celdaCuota.appendChild(textoCuota);
    hilera.appendChild(celdaCuota);

    const celdaCapital = document.createElement("td");
    const textoCapital = document.createTextNode(capitalRestante.toFixed(2));
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




function calcularCripto() {
  var impuestos = 0;
  const ganancias = parseFloat(document.getElementById('ganancias').value) || 0;
  var gananciaEntera = Math.floor(ganancias);
  const radioCripto1 = document.getElementById('venta');
  const radioCripto2 = document.getElementById('cambio');
  const radioCripto3 = document.getElementById('prestamo');
  const radioCripto4 = document.getElementById('regalo');
  const radioCripto5 = document.getElementById('mineria');


  if (radioCripto1.checked || radioCripto2.checked || radioCripto3.checked || radioCripto4.checked || radioCripto5.checked) {
    if (ganancias <= 6000) {
      impuestos = ganancias * 0.19;
    } else if (ganancias <= 50000) {
      impuestos = (6000 * 0.19) +
        ((ganancias - 6000) * 0.21);
    } else if (ganancias <= 200000) {
      impuestos = (6000 * 0.19) +
        (44000 * 0.21) +
        ((ganancias - 50000) * 0.23);
    } else if (ganancias <= 300000) {
      impuestos = (6000 * 0.19) +
        (44000 * 0.21) +
        (150000 * 0.23) +
        ((ganancias - 200000) * 0.27);
    } else {
      impuestos = (6000 * 0.19) +
        (44000 * 0.21) +
        (150000 * 0.23) +
        (100000 * 0.27) +
        ((ganancias - 300000) * 0.28);
    }
    resultados.innerHTML = `
      <p><strong>(+)Tus ganancias:</strong> €${gananciaEntera.toFixed(2)}</p>
      <p><strong>(-)Tus perdidas:</strong> €${impuestos.toFixed(2)}</p>
      <p><strong>(=)Después de impuestos:</strong> €${ganancias.toFixed(2)}</p>
  `;

  } else if (regaloCripto.checked || mineriaCripto.checked) {
    if (ganancias <= 12450) {
      impuestos = ganancias * 0.19;
    } else if (ganancias <= 20200) {
      impuestos = (12450 * 0.19) +
        ((ganancias - 12450) * 0.24);
    } else if (ganancias <= 35200) {
      impuestos = (12450 * 0.19) +
        ((20200 - 12450) * 0.24) +
        ((ganancias - 20200) * 0.30);
    } else if (ganancias <= 60000) {
      impuestos = (12450 * 0.19) +
        ((20200 - 12450) * 0.24) +
        ((35200 - 20200) * 0.30) +
        ((ganancias - 35200) * 0.37);
    } else if (ganancias <= 300000) {
      impuestos = (12450 * 0.19) +
        ((20200 - 12450) * 0.24) +
        ((35200 - 20200) * 0.30) +
        ((60000 - 35200) * 0.37) +
        ((ganancias - 60000) * 0.45);
    } else {
      impuestos = (12450 * 0.19) +
        ((20200 - 12450) * 0.24) +
        ((35200 - 20200) * 0.30) +
        ((60000 - 35200) * 0.37) +
        ((300000 - 60000) * 0.45) +
        ((ganancias - 300000) * 0.47);
    }
    resultados.innerHTML = `
      <p><strong>(+)Tus ganancias:</strong> €${gananciaEntera.toFixed(2)}</p>
      <p><strong>(-)Tus perdidas:</strong> €${impuestos.toFixed(2)}</p>
      <p><strong>(=)Después de impuestos:</strong> €${ganancias.toFixed(2)}</p>
  `;
  }
}






function cambiarContenido(tabId) {
  const graficoHipoteca = document.getElementById('graficoHipoteca');
  const graficoPrestamo = document.getElementById('graficoPrestamo');
  if (graficoHipoteca) graficoHipoteca.style.display = 'none';
  if (graficoPrestamo) graficoPrestamo.style.display = 'none';
  if (chart) {
    chart.destroy();
    chart = null;
  }
  formulario.innerHTML = contenido[tabId].campos;
  resultados.innerHTML = contenido[tabId].resultados;

  setTimeout(() => {
    const btnHipoteca = document.getElementById('btnHipoteca');
    const btnPrestamo = document.getElementById('btnPrestamo');
    const btnAutonomo = document.getElementById('btnAutonomo');

    if (btnHipoteca) {
      btnHipoteca.addEventListener('click', () => {
        mostrarGrafico('renta');
      });
    }

    if (btnPrestamo) {
      btnPrestamo.addEventListener('click', () => {
        mostrarGrafico('iva');
      });
    }

    if (btnAutonomo) {
      btnAutonomo.addEventListener('click', () => {
        // Aquí puedes poner la lógica para la pestaña de autónomos si lo necesitas
      });
    }
  }, 100);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    cambiarContenido(tab.dataset.tab);
  });
});

// Inicialización por defecto
cambiarContenido('renta');
