function calcularLinea() {
  const capitalInicial = parseFloat(document.getElementById('capital').value);
  const plazoPrestamo = parseInt(document.getElementById('plazoPrestamo').value);
  const tipoInteres = parseFloat(document.getElementById('tipoInteres').value);
  //falta meter el checkbox
  // const checkbox = document.getElementById('checkbox').checked;
  const interesPost = parseFloat(document.getElementById('interesPost').value);
  const anioCambio = parseInt(document.getElementById('anioCambio').value);



  const cuotaMensual = (capitalInicial * tipoInteres / 100) / 12;
  const totalIntereses = cuotaMensual * plazoPrestamo * 12 - capitalInicial;
  const cuotaMensualConImpuesto = cuotaMensual * (1 + interesPost / 100);

  resultados.innerHTML = `
    <p><strong>Cuota mensual:</strong> €${cuotaMensual.toFixed(2)}</p>
    <p><strong>Total intereses:</strong> €${totalIntereses.toFixed(2)}</p>
    <p><strong>Cuota mensual con impuesto:</strong> €${cuotaMensualConImpuesto.toFixed(2)}</p>
  `;


  const labels = Array.from({ length: plazoPrestamo }, (_, i) => `Año ${i + 1}`);

  let capitalRestante = capitalInicial;
  const listaDeLineasCapital = [];
  for (let i = 1; i <= plazoPrestamo; i++) {
    capitalRestante -= cuotaMensualConImpuesto * 12; // anual
    listaDeLineasCapital.push(Math.max(capitalRestante, 0)); // Evitar negativos
  }

  let capitalRestanteSinInteres = capitalInicial;
  const listaDeLineasCapitalSin = [];
  for (let i = 1; i <= plazoPrestamo; i++) {
    capitalRestanteSinInteres -= cuotaMensual * 12; // 
    listaDeLineasCapitalSin.push(Math.max(capitalRestanteSinInteres, 0)); // Evitar negativos
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
}
