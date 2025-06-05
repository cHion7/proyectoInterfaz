// Elementos del DOM
const tabs = document.querySelectorAll('.tabs__item');
const formulario = document.getElementById('formulario');
const resultados = document.getElementById('resultados');
let chart = null;

// Contenido de los formularios y resultados
const contenido = {
  hipoteca: {
    titulo: "Formulario de Hipoteca",
    campos: `
      <div class="formulario__grupo">
        <label for="precio">Precio inmueble (€)</label>
        <div class="input-icono">
          <i class="fas fa-home"></i>
          <input type="number" id="precio" placeholder="Ej: 300000">
        </div>
      </div>

      <div class="formulario__grupo">
        <label for="ahorro">Ahorro aportado (€)</label>
        <div class="input-icono">
          <i class="fas fa-piggy-bank"></i>
          <input type="number" id="ahorro" placeholder="Ej: 50000">
        </div>
      </div>

      <div class="formulario__grid-dos">
        <div class="formulario__grupo">
          <label for="plazo">Plazo (años)</label>
          <div class="input-icono">
            <i class="far fa-calendar"></i>
            <input type="number" id="plazo" placeholder="Ej: 30">
          </div>
        </div>
        <div class="formulario__grupo">
          <label for="impuesto">Interés (%)</label>
          <div class="input-icono">
            <i class="fas fa-percent"></i>
            <input type="number" id="impuesto" placeholder="Ej: 3.5" step="0.1">
          </div>
        </div>
      </div>

      <div class="formulario__boton-contenedor">
        <button type="button" id="btnHipoteca" class="btn-primary">
          <i class="fas fa-calculator"></i>
          Calcular hipoteca
        </button>
      </div>
    `,
    resultados: `
      <div class="resultados__contenedor">
        <div class="result-item">
          <span>Cuota mensual</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Cuota mensual sin interés</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Importe hipoteca</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Interés mensual</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Interés anual</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Coste total</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-total">
          <div class="result-total__contenedor">
            <span>Total a pagar:</span>
            <span id="resultadoTotalHipoteca" class="resultado-total-valor">€0.00</span>
          </div>
        </div>
      </div>
    `
  },
  prestamo: {
    titulo: "Formulario de Préstamo",
    campos: `
      <div class="formulario__grupo">
        <label for="capital">Capital inicial (€)</label>
        <div class="input-icono">
          <i class="fas fa-money-bill-wave"></i>
          <input type="number" id="capital" placeholder="Ej: 10000">
        </div>
      </div>

      <div class="formulario__grid-dos">
        <div class="formulario__grupo">
          <label for="plazoPrestamo">Plazo (años)</label>
          <div class="input-icono">
            <i class="far fa-calendar"></i>
            <input type="number" id="plazoPrestamo" placeholder="Ej: 5">
          </div>
        </div>
        <div class="formulario__grupo">
          <label for="tipoInteres">Interés (%)</label>
          <div class="input-icono">
            <i class="fas fa-percent"></i>
            <input type="number" id="tipoInteres" placeholder="Ej: 4.5" step="0.1">
          </div>
        </div>
      </div>

      <div class="formulario__boton-contenedor">
        <button type="button" id="btnPrestamo" class="btn-primary">
          <i class="fas fa-calculator"></i>
          Calcular préstamo
        </button>
      </div>
    `,
    resultados: `
      <div class="resultados__contenedor">
        <div class="result-item">
          <span>Anualidad</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Total intereses</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-item">
          <span>Total a pagar</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-total">
          <div class="result-total__contenedor">
            <span>Total:</span>
            <span id="resultadoTotalPrestamo" class="resultado-total-valor">€0.00</span>
          </div>
        </div>
      </div>
    `
  },
  criptomonedas: {
    titulo: "Formulario de Criptomonedas",
    campos: `
      <div class="formulario__grupo">
        <h3>¿Cómo has ganado dinero?</h3>
        <div class="cryptoradio__contenedor">
          <div class="cryptoradio__item">
            <input type="radio" id="venta" name="tipoOperacion" value="vender">
            <label for="venta">
              <i class="fas fa-exchange-alt"></i>
              He vendido criptomonedas
            </label>
          </div>
          <div class="cryptoradio__item">
            <input type="radio" id="cambio" name="tipoOperacion" value="cambiar">
            <label for="cambio">
              <i class="fas fa-sync-alt"></i>
              He cambiado una criptomoneda por otra
            </label>
          </div>
          <div class="cryptoradio__item">
            <input type="radio" id="regalo" name="tipoOperacion" value="regalar">
            <label for="regalo">
              <i class="fas fa-gift"></i>
              Me han regalado criptomonedas
            </label>
          </div>
          <div class="cryptoradio__item">
            <input type="radio" id="mineria" name="tipoOperacion" value="minar">
            <label for="mineria">
              <i class="fas fa-digging"></i>
              Hago minería de criptomonedas
            </label>
          </div>
          <div class="cryptoradio__item">
            <input type="radio" id="prestamo" name="tipoOperacion" value="prestar">
            <label for="prestamo">
              <i class="fas fa-hand-holding-usd"></i>
              Presto criptomonedas
            </label>
          </div>
        </div>
      </div>

      <div class="formulario__grupo">
        <label for="ganancias">Ganancias (€)</label>
        <div class="input-icono">
          <i class="fas fa-euro-sign"></i>
          <input type="number" id="ganancias" placeholder="Ej: 1000">
        </div>
      </div>

      <div class="formulario__boton-contenedor">
        <button type="button" id="btnCriptomoneda" class="btn-primary">
          <i class="fas fa-calculator"></i>
          Calcular impuestos
        </button>
      </div>
    `,
    resultados: `
      <div class="resultados__contenedor">
        <div class="result-item">
          <span>Tus ganancias</span>
          <span class="resultado-valor text--verde">€0.00</span>
        </div>
        <div class="result-item">
          <span>Tus pérdidas (impuestos)</span>
          <span class="resultado-valor text--rojo">€0.00</span>
        </div>
        <div class="result-item">
          <span>Después de impuestos</span>
          <span class="resultado-valor">€0.00</span>
        </div>
        <div class="result-total">
          <div class="result-total__contenedor">
            <span>Beneficio neto:</span>
            <span id="resultadoTotalCripto" class="resultado-total-valor">€0.00</span>
          </div>
        </div>
      </div>
    `
  }
};

// Funciones auxiliares
function ocultarGraficos() {
  document.getElementById('graficoHipoteca').classList.add('card--oculto');
  document.getElementById('graficoPrestamo').classList.add('card--oculto');
  if (chart) {
    chart.destroy();
    chart = null;
  }
}

// Cálculo y renderizado de pie chart para hipoteca
function calcularPie() {
  ocultarGraficos();

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

  // Actualizar resultados (se asume que ya existe el HTML de resultados en el DOM)
  const valores = resultados.querySelectorAll('.resultado-valor');
  valores[0].textContent = `€${cuotaMensualCalculada.toFixed(2)}`;
  valores[1].textContent = `€${cuotaMensualSinInteres.toFixed(2)}`;
  valores[2].textContent = `€${hipoteca.toFixed(2)}`;
  valores[3].textContent = `€${(interesesTotales / numeroCuotas).toFixed(2)}`;
  valores[4].textContent = `€${(interesesTotales / plazo).toFixed(2)}`;
  valores[5].textContent = `€${costeTotal.toFixed(2)}`;

  document.getElementById('resultadoTotalHipoteca').textContent = `€${costeTotal.toFixed(2)}`;

  // Mostrar gráfico de pastel
  const seccionGrafico = document.getElementById('graficoHipoteca');
  seccionGrafico.classList.remove('card--oculto');
  const ctx = document.getElementById('graficoPie').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Ahorro', 'Intereses', 'Precio inmueble', 'Hipoteca'],
      datasets: [{
        data: [
          Math.max(ahorro, 0),
          Math.max(interesesTotales, 0),
          Math.max(precio - ahorro - hipoteca, 0),
          Math.max(hipoteca, 0)
        ],
        backgroundColor: ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14 },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: €${context.raw.toFixed(2)}`
          }
        },
        title: {
          display: true,
          text: 'Distribución de Costes',
          font: { size: 18 },
          padding: { top: 10, bottom: 30 }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });
}

// Cálculo y renderizado de line chart y tabla para préstamo
function calcularLinea() {
  ocultarGraficos();

  const capitalInicial = parseFloat(document.getElementById('capital').value) || 0;
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

  // Actualizar resultados
  const valores = resultados.querySelectorAll('.resultado-valor');
  valores[0].textContent = `€${anualidad.toFixed(2)}`;
  valores[1].textContent = `€${totalIntereses.toFixed(2)}`;
  valores[2].textContent = `€${(totalIntereses + capitalInicial).toFixed(2)}`;

  document.getElementById('resultadoTotalPrestamo').textContent = `€${(totalIntereses + capitalInicial).toFixed(2)}`;

  // Mostrar gráfico de línea
  const seccionGrafico = document.getElementById('graficoPrestamo');
  seccionGrafico.classList.remove('card--oculto');
  const ctx = document.getElementById('graficoBarra').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: plazoPrestamo }, (_, i) => `Año ${i + 1}`),
      datasets: [
        {
          label: 'Capital pendiente',
          data: capitalPendienteArray,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: 'Intereses',
          data: interesesArray,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: 'Capital acumulado',
          data: capitalAcumuladoArray,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderWidth: 2,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolución del Préstamo',
          font: { size: 18 },
          padding: { top: 10, bottom: 20 }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `€${value}`
          }
        }
      }
    }
  });

  // Generar tabla
  generaTabla(precio = plazoPrestamo, anualidad, interesesArray, capitalAcumuladoArray, capitalPendienteArray);
}

function generaTabla(anos, anualidad, intereses, capitalAcumulado, capitalPendiente) {
  const contenedor = document.getElementById("creacionDeTabla");
  contenedor.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'tabla';

  // Cabecera
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Año</th>
      <th>Anualidad</th>
      <th>Intereses</th>
      <th>Amortizado</th>
      <th>Pendiente</th>
    </tr>
  `;

  // Cuerpo
  const tbody = document.createElement('tbody');
  for (let i = 0; i < anos; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>€${anualidad.toFixed(2)}</td>
      <td>€${intereses[i].toFixed(2)}</td>
      <td>€${capitalAcumulado[i].toFixed(2)}</td>
      <td>€${capitalPendiente[i].toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  contenedor.appendChild(table);
}

// Cálculo de impuestos para criptomonedas
function calcularCripto() {
  ocultarGraficos();

  let impuestos = 0;
  const ganancias = parseFloat(document.getElementById('ganancias').value) || 0;
  const ventaCripto = document.getElementById('venta');
  const cambioCripto = document.getElementById('cambio');
  const prestarCripto = document.getElementById('prestamo');
  const regaloCripto = document.getElementById('regalo');
  const mineriaCripto = document.getElementById('mineria');

  if (ventaCripto.checked || cambioCripto.checked || prestarCripto.checked) {
    if (ganancias <= 6000) {
      impuestos = ganancias * 0.19;
    } else if (ganancias <= 50000) {
      impuestos = (6000 * 0.19) + ((ganancias - 6000) * 0.21);
    } else if (ganancias <= 200000) {
      impuestos = (6000 * 0.19) + (44000 * 0.21) + ((ganancias - 50000) * 0.23);
    } else if (ganancias <= 300000) {
      impuestos = (6000 * 0.19) + (44000 * 0.21) + (150000 * 0.23) + ((ganancias - 200000) * 0.27);
    } else {
      impuestos = (6000 * 0.19) + (44000 * 0.21) + (150000 * 0.23) + (100000 * 0.27) + ((ganancias - 300000) * 0.28);
    }
  } else if (regaloCripto.checked || mineriaCripto.checked) {
    if (ganancias <= 12450) {
      impuestos = ganancias * 0.19;
    } else if (ganancias <= 20200) {
      impuestos = (12450 * 0.19) + ((ganancias - 12450) * 0.24);
    } else if (ganancias <= 35200) {
      impuestos = (12450 * 0.19) + ((20200 - 12450) * 0.24) + ((ganancias - 20200) * 0.30);
    } else if (ganancias <= 60000) {
      impuestos = (12450 * 0.19) + ((20200 - 12450) * 0.24) + ((35200 - 20200) * 0.30) + ((ganancias - 35200) * 0.37);
    } else if (ganancias <= 300000) {
      impuestos = (12450 * 0.19) + ((20200 - 12450) * 0.24) + ((35200 - 20200) * 0.30) + ((60000 - 35200) * 0.37) + ((ganancias - 60000) * 0.45);
    } else {
      impuestos = (12450 * 0.19) + ((20200 - 12450) * 0.24) + ((35200 - 20200) * 0.30) + ((60000 - 35200) * 0.37) + ((300000 - 60000) * 0.45) + ((ganancias - 300000) * 0.47);
    }
  }

  // Actualizar resultados
  const valores = resultados.querySelectorAll('.resultado-valor');
  valores[0].textContent = `€${ganancias.toFixed(2)}`;
  valores[1].textContent = `€${impuestos.toFixed(2)}`;
  valores[2].textContent = `€${(ganancias - impuestos).toFixed(2)}`;

  document.getElementById('resultadoTotalCripto').textContent = `€${(ganancias - impuestos).toFixed(2)}`;
}

// Cambiar pestañas
function cambiarContenido(tabId) {
  const tituloForm = document.getElementById('form-title');
  tituloForm.textContent = contenido[tabId].titulo;

  formulario.innerHTML = contenido[tabId].campos;
  resultados.innerHTML = contenido[tabId].resultados;

  ocultarGraficos();

  // Vincular el botón correspondiente
  if (tabId === 'hipoteca') {
    document.getElementById('btnHipoteca').addEventListener('click', calcularPie);
  } else if (tabId === 'prestamo') {
    document.getElementById('btnPrestamo').addEventListener('click', calcularLinea);
  } else if (tabId === 'criptomonedas') {
    document.getElementById('btnCriptomoneda').addEventListener('click', calcularCripto);
  }
}

// Event Listeners para las pestañas
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remover clase activa de todas las pestañas
    tabs.forEach(t => t.classList.remove('tabs__item--activo'));
    // Marcar esta pestaña como activa
    tab.classList.add('tabs__item--activo');

    const tabId = tab.getAttribute('data-tab');
    cambiarContenido(tabId);
  });
});

// Inicialización al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  // Marcar la primera pestaña (hipoteca) como activa
  const primera = document.querySelector('.tabs__item[data-tab="hipoteca"]');
  primera.classList.add('tabs__item--activo');
  cambiarContenido('hipoteca');

  // Efecto de animación a las tarjetas
  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('fade-in');
  });
});
