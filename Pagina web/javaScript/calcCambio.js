const tabs = document.querySelectorAll('#tabs li');
const formulario = document.getElementById('formulario');
const resultados = document.getElementById('resultados');

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
      <input type="radio" id="opcion1" name="autonomos" value="opcion1">
      <label for="opcion1">Opción 1</label><br>
      <input type="radio" id="opcion2" name="autonomos" value="opcion2">
      <label for="opcion2">Opción 2</label><br>
      <input type="radio" id="opcion3" name="autonomos" value="opcion3">
      <label for="opcion3">Opción 3</label><br>
      <input type="radio" id="opcion4" name="autonomos" value="opcion4">
      <label for="opcion4">Opción 4</label><br>
      <input type="radio" id="opcion5" name="autonomos" value="opcion5">
      <label for="opcion5">Opción 5</label><br><br>
      <label for="lineEdit">¿Cuánto dinero has ganado?:</label><br>
      <input type="text" id="lineEdit"><br><br>
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

  graficoHipoteca.style.display = 'none';
  graficoPrestamo.style.display = 'none';

  if (tabId === 'renta') {
    calcularPie();

  } else if (tabId === 'iva') {
    if (!window.graficoBarraCreado) {
      const ctx = document.getElementById('graficoBarra').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Año 1', 'Año 2', 'Año 3'],
          datasets: [{
            label: 'Deuda',
            data: [1000, 700, 400],
            backgroundColor: '#2196F3'
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Evolución del Préstamo'
            }
          }
        }
      });
      window.graficoBarraCreado = true;
    }
    graficoPrestamo.style.display = 'block';
  }
}

function calcularPie() {
  const precio = parseFloat(document.getElementById('precio').value);
  const ahorro = parseFloat(document.getElementById('ahorro').value);
  const plazo = parseInt(document.getElementById('plazo').value);
  const impuesto = parseFloat(document.getElementById('impuesto').value);

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

  const resultados = document.getElementById('resultados');
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

  if (!window.graficoPieCreado) {
    const ctx = document.getElementById('graficoPie').getContext('2d');

    new Chart(ctx, {
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
    window.graficoPieCreado = true;
  }
  graficoHipoteca.style.display = 'block';
}



function calcularBarra() {
  const capital = parseFloat(document.getElementById('capital').value);
  const plazoPrestamo = parseInt(document.getElementById('plazoPrestamo').value);
  const tipoInteres = parseFloat(document.getElementById('tipoInteres').value);
  const interesPost = parseFloat(document.getElementById('interesPost').value);
  const anioCambio = parseInt(document.getElementById('anioCambio').value);
  const cuotaMensual = (capital * tipoInteres / 100) / 12;
  const totalIntereses = cuotaMensual * plazoPrestamo * 12 - capital;
  const cuotaMensualConImpuesto = cuotaMensual * (1 + interesPost / 100);

  resultados.innerHTML = `
    <p><strong>Cuota mensual:</strong> €${cuotaMensual.toFixed(2)}</p>
    <p><strong>Total intereses:</strong> €${totalIntereses.toFixed(2)}</p>
    <p><strong>Cuota mensual con impuesto:</strong> €${cuotaMensualConImpuesto.toFixed(2)}</p>
  `;
}

function cambiarContenido(tabId) {
  graficoHipoteca.style.display = 'none';
  graficoPrestamo.style.display = 'none';
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
        // Lógica adicional para mostrar gráfico en la pestaña autónomos
        // (puedes añadirlo según lo necesites)
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
