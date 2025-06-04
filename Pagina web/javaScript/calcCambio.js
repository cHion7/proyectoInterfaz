const tabs = document.querySelectorAll('#tabs li');
const formulario = document.getElementById('formulario');
const resultados = document.getElementById('resultados');
let chart = null;

const contenido = {
  hipoteca: {
    campos: `
      <label for="precio">Precio inmueble:</label><br>
      <input type="number" id="precio" placeholder="Ej: 300000"><br><br>
      <label for="ahorro">Ahorro aportado:</label><br>
      <input type="number" id="ahorro" placeholder="Ej: 5000"><br><br>
      <label for="plazo">Plazo préstamo:</label><br>
      <input type="number" id="plazo" placeholder="Ej: 30"><br><br>
      <label for="impuesto">Impuesto:</label><br>
      <input type="number" id="impuesto" placeholder="Ej: 7"><br><br>
      <button type="button" id="btnHipoteca" onclick=calcularPie()>Calcular hipoteca</button>
    `,
    resultados: `
    <p><strong>Cuota mensual sin interés:</strong></p>
    <p><strong>Importe hipoteca:</strong></p>
    <p><strong>Interés mensual:</strong></p>
    <p><strong>Interes anual:</strong></p>
    <p><strong>Coste total:</strong></p>
    `
  },
  prestamo: {
    campos: `
      <label for="capital" >Capital inicial:</label><br>
      <input type="number" id="capital" placeholder="Ej: 10000"><br><br>
      <label for="plazoPrestamo">Plazo (años):</label><br>
      <input type="number" id="plazoPrestamo" placeholder="Ej: 30"><br><br>
      <label for="tipoInteres">Tipo interés (%):</label><br>
      <input type="number" id="tipoInteres" placeholder="Ej: 3.5"><br><br>
      <button type="button" id="btnPrestamo" onclick=calcularLinea()>Calcular préstamo</button>
    `,
    resultados: `
      <p><strong>Mensualidad:</strong> €0.00</p>
      <p><strong>Mensualidad posterior:</strong> €0.00</p>
    `
  },
  criptomonedas: {
    campos: `
      <label>¿Cómo has ganado dinero?:</label><br>
      <label>Seleccione una opción:</label><br>
      <label for="venta">He vendido criptomonedas</label><br>
      <input type="radio" id="venta" name="tipoOperacion" value="vender">

      <label for="cambio">He cambiado una criptomoneda por otra</label><br>
      <input type="radio" id="cambio" name="tipoOperacion" value="cambiar">

      <label for="regalo">Me han regalado criptomonedas</label><br>
      <input type="radio" id="regalo" name="tipoOperacion" value="regalar">

      <label for="mineria">Hago minería de criptomonedas</label><br>
      <input type="radio" id="mineria" name="tipoOperacion" value="minar">

      <label for="prestamo">Presto criptomonedas</label><br>
      <input type="radio" id="prestamo" name="tipoOperacion" value="prestar">

      <label for="ganancias">¿Cuánto dinero has ganado?:</label><br>

      <input type="text" id="ganancias" placeholder="Ej: 1000"><br><br>
      <button type="button" id="btnCriptomoneda" onclick=calcularCripto()>Calcular</button>
    `,
    resultados: `
      <p><strong>(+)Tus ganancias:</strong> €0.00</p>
      <p><strong>(-)Tus perdidas:</strong> €0.00</p>
      <p><strong>(=)Después de impuestos:</strong> €0.00</p>
    `
  }
};

function quitarGraficos() {
  const graficoHipoteca = document.getElementById('graficoHipoteca');
  const graficoPrestamo = document.getElementById('graficoPrestamo');
  if (graficoHipoteca) graficoHipoteca.style.display = 'none';
  if (graficoPrestamo) graficoPrestamo.style.display = 'none';

  if (chart) {
    chart.destroy();
    chart = null;
  }
}

function calcularPie() {
  quitarGraficos();
  const precio = parseFloat(document.getElementById('precio').value) || 0;
  const ahorro = parseFloat(document.getElementById('ahorro').value) || 0;
  const plazo = parseInt(document.getElementById('plazo').value) || 1;
  const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;


  const hipoteca = precio - ahorro;
  const interesAnual = impuesto / 100;
  const interesMensual = interesAnual / 12;
  const numeroCuotas = Math.floor(plazo * 12);

  const pow = Math.pow(1 + interesMensual, numeroCuotas);
  const cuotaMensualCalculada = hipoteca * ((interesMensual * pow) / (pow - 1));
  const cuotaMensualSinInteres = hipoteca / numeroCuotas;

  const totalPagado = cuotaMensualCalculada * numeroCuotas;
  const interesesTotales = totalPagado - hipoteca;
  const costeTotal = precio + interesesTotales;

  resultados.innerHTML = `
    <p><strong>Cuota mensual:</strong> €${cuotaMensualCalculada.toFixed(2)}</p>
    <p><strong>Cuota mensual sin interés:</strong> €${cuotaMensualSinInteres.toFixed(2)}</p>
    <p><strong>Importe hipoteca:</strong> €${hipoteca.toFixed(2)}</p>
    <p><strong>Interés mensual:</strong> €${(interesesTotales / numeroCuotas).toFixed(2)}</p>
    <p><strong>Interes anual:</strong> €${(interesesTotales / plazo).toFixed(2)}</p>
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
    <p><strong>Pago tatal:</strong> €${(totalIntereses + capitalInicial).toFixed(2)}</p>
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

  if (graficoPrestamo) graficoPrestamo.style.display = 'flex';
  genera_tabla(plazoPrestamo, anualidad, interesesArray, capitalAcumuladoArray, capitalPendienteArray);

}

function genera_tabla(anos, anualidad, intereses, capitalAcumulado, capitalPendiente) {
  const body = document.getElementById("creacionDeTabla");
  const tablasExistentes = document.querySelectorAll("table");
  tablasExistentes.forEach(tabla => tabla.remove());

  const datosPrincipales = ["Años", "Anualidad (€)", "Intereses (€)", "Cuota amortizada (€)", "Capital pendiente (€)"];

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

    const celdaAnualidad = document.createElement("td");
    const textoAnualidad = document.createTextNode(anualidad.toFixed(2));
    celdaAnualidad.appendChild(textoAnualidad);
    hilera.appendChild(celdaAnualidad);

    const celdaInteres = document.createElement("td");
    const textoInteres = document.createTextNode(intereses[i].toFixed(2));
    celdaInteres.appendChild(textoInteres);
    hilera.appendChild(celdaInteres);

    const celdaCuota = document.createElement("td");
    const textoCuota = document.createTextNode(capitalAcumulado[i].toFixed(2));
    celdaCuota.appendChild(textoCuota);
    hilera.appendChild(celdaCuota);

    const celdaCapitalPendiente = document.createElement("td");
    const textoCapitalPendiente = document.createTextNode(capitalPendiente[i].toFixed(2));
    celdaCapitalPendiente.appendChild(textoCapitalPendiente);
    hilera.appendChild(celdaCapitalPendiente);

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
  quitarGraficos();
  var impuestos = 0;
  const ganancias = parseFloat(document.getElementById('ganancias').value) || 0;
  var gananciaEntera = Math.floor(ganancias);
  const ventaCripto = document.getElementById('venta');
  const cambioCripto = document.getElementById('cambio');
  const prestarCripto = document.getElementById('prestamo');
  const regaloCripto = document.getElementById('regalo');
  const mineriaCripto = document.getElementById('mineria');


  if (ventaCripto.checked || cambioCripto.checked || prestarCripto.checked) {
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
      <p><strong>(=)Después de impuestos:</strong> €${(ganancias - impuestos).toFixed(2)}</p>
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
      <p><strong>(=)Después de impuestos:</strong> €${(ganancias - impuestos).toFixed(2)}</p>
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
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    cambiarContenido(tab.dataset.tab);
  });
});


cambiarContenido('hipoteca');



