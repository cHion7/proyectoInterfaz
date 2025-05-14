let graficoHipotecaCreado = false;
let graficoPrestamoCreado = false;

// Al pulsar Calcular Hipoteca
document.getElementById('calcularHipoteca').addEventListener('click', function (e) {
    e.preventDefault();

    // Mostrar gráfico hipoteca, ocultar otros
    document.getElementById('graficoHipoteca').style.display = 'block';
    document.getElementById('graficoPrestamo').style.display = 'none';

    if (!graficoHipotecaCreado) {
        const ctx = document.getElementById('graficoPie').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Capital', 'Intereses'],
                datasets: [{
                    data: [70, 30],
                    backgroundColor: ['#4CAF50', '#FF5722']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Hipoteca'
                    }
                }
            }
        });
        graficoHipotecaCreado = true;
    }
});

// Al pulsar Calcular Prestamo
document.getElementById('calcularPrestamo').addEventListener('click', function (e) {
    e.preventDefault();

    // Mostrar gráfico préstamo, ocultar otros
    document.getElementById('graficoPrestamo').style.display = 'block';
    document.getElementById('graficoHipoteca').style.display = 'none';

    if (!graficoPrestamoCreado) {
        const ctx = document.getElementById('graficoBarra').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4'],
                datasets: [{
                    label: 'Deuda',
                    data: [1000, 800, 600, 400],
                    backgroundColor: '#2196F3'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Pago del Préstamo Mensual'
                    }
                }
            }
        });
        graficoPrestamoCreado = true;
    }
});
