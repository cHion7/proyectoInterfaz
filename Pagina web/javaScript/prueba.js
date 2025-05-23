function genera_tabla(anos, interes, cuotamensual, capitalRestante, interesPost, anioCambio, cuotaMensualConImpuestoPost) {
  // Obtener la referencia del elemento donde se insertará la tabla
  const body = document.getElementsByTagName("creacionDeTabla")[0];

  // Limpiar tablas anteriores
  const tablasExistentes = document.querySelectorAll("table");
  tablasExistentes.forEach(tabla => tabla.remove());

  // Cabeceras de la tabla
  const datosPrincipales = ["Años", "Interés", "Cuota sin interés", "Capital pendiente"];

  // Crear elementos de la tabla
  const tabla = document.createElement("table");
  const tblHead = document.createElement("thead");
  const tblBody = document.createElement("tbody");

  // Crear la fila de cabeceras
  const hileraCabecera = document.createElement("tr");
  datosPrincipales.forEach(dato => {
    const celda = document.createElement("th");
    const textoCelda = document.createTextNode(dato);
    celda.appendChild(textoCelda);
    hileraCabecera.appendChild(celda);
  });
  tblHead.appendChild(hileraCabecera);

  // Crear las filas de datos
  for (let i = 0; i < anos; i++) {
    const hilera = document.createElement("tr");

    // Columna 1: Años
    const celdaAnio = document.createElement("td");
    const textoAnio = document.createTextNode(`Año ${i + 1}`);
    celdaAnio.appendChild(textoAnio);
    hilera.appendChild(celdaAnio);

    // Columna 2: Interés
    const celdaInteres = document.createElement("td");
    const textoInteres = document.createTextNode(i < anioCambio ? interes.toFixed(2) : interesPost.toFixed(2));
    celdaInteres.appendChild(textoInteres);
    hilera.appendChild(celdaInteres);

    // Columna 3: Cuota sin interés
    const celdaCuota = document.createElement("td");
    const textoCuota = document.createTextNode(cuotamensual.toFixed(2));
    celdaCuota.appendChild(textoCuota);
    hilera.appendChild(celdaCuota);

    // Columna 4: Capital pendiente
    const celdaCapital = document.createElement("td");
    const textoCapital = document.createTextNode(capitalRestante.toFixed(2));
    celdaCapital.appendChild(textoCapital);
    hilera.appendChild(celdaCapital);

    // Actualizar el capital restante
    if (i < anioCambio) {
      capitalRestante -= cuotamensual * 12;
    } else {
      capitalRestante -= cuotaMensualConImpuestoPost * 12;
    }

    // Agregar la fila al cuerpo de la tabla
    tblBody.appendChild(hilera);
  }

  // Agregar cabecera y cuerpo a la tabla
  tabla.appendChild(tblHead);
  tabla.appendChild(tblBody);

  // Agregar estilos básicos a la tabla
  tabla.style.borderCollapse = "collapse";
  tabla.style.width = "80%";
  tabla.style.margin = "20px auto";
  tabla.style.border = "1px solid #ddd";
  tabla.querySelectorAll("th, td").forEach(cell => {
    cell.style.border = "1px solid #ddd";
    cell.style.padding = "8px";
    cell.style.textAlign = "center";
  });

  // Agregar la tabla al cuerpo del documento
  body.appendChild(tabla);
}