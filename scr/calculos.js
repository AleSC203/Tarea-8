async function Calculos() {

    // 1. Obtener fechas
    const fechaRetiroVal = document.querySelector('input[name="fechaRetiro"]').value;
    const fechaDevolucionVal = document.querySelector('input[name="fechadevolucion"]').value;

    if (!fechaRetiroVal || !fechaDevolucionVal) {
        alert("Por favor ingrese ambas fechas: Retiro y Devolución.");
        return;
    }

    const fechaRetiro = new Date(fechaRetiroVal);
    const fechaDevolucion = new Date(fechaDevolucionVal);

    const diffMs = fechaDevolucion - fechaRetiro;
    const dias = diffMs / (1000 * 60 * 60 * 24);

    if (dias < 3 || dias > 365) {
        alert("Los días seleccionados no son correctos. Deben estar entre 3 y 365.");
        return;
    }

    // Mostrar días calculados
    document.getElementById("dias").value = dias;





    // 2. Obtener tarifas de vehículo y seguro
    const TDV = parseFloat(document.getElementById("tipoVehiculo").value);
    const TDS = parseFloat(document.getElementById("seguro").value);

    // Calcular tarifa diaria base
    let TD = TDV + TDS;

    // Descuento según días
    let descDias = 0;
    if (dias > 30 && dias < 120) {
        descDias = 0.15;
    } else if (dias >= 120 && dias <= 365) {
        descDias = 0.25;
    }

    TD = TD * (1 - descDias);





    // 3. Obtener cca3 del país cliente
    const cca3 = document.getElementById("nacionalidad").value;

    // 4. Consultar región vía API
    let region = "";
    try {
        const respuesta = await fetch(`https://restcountries.com/v3.1/alpha?codes=${cca3}`);
        const datosRegion = await respuesta.json();
        if (datosRegion && datosRegion[0] && datosRegion[0].region) {
            region = datosRegion[0].region;
        }
    } catch (error) {
        console.error("Error consultando la región:", error);
        alert("No se pudo obtener la región del país, se aplicará descuento 0%.");
    }



    // 5. Descuento por región
    let descRegion = 0;
    if (region === "Americas" || region === "Europe") {
        descRegion = 0.10;
    } else if (region === "Africa") {
        descRegion = 0.05;
    }

    // Total porcentaje de descuento (días + región)
    const descTotal = descDias + descRegion;


    // 6. Calcular total a pagar
    const totalPagar = TD * dias * (1 - descTotal);

    // 7. Mostrar resultados
    document.getElementById("td").value = TD.toFixed(2);
    document.querySelector('input[name="totalPagar"]').value = totalPagar.toFixed(2);


    return {
        fechaRetiro: fechaRetiro,
        fechaDevolucion: fechaDevolucion,
        dias: dias,
        tarifaDiaria: TD,
        descuentoTotal: descTotal,
        totalPagar: totalPagar,
        region: region,
        descuentoPorRegion: descRegion
    };

}





let resultadoCalculos = null;

async function ejecutarCalculos() {
    resultadoCalculos = await Calculos();

    if (!resultadoCalculos) {
        alert("No se pudo calcular la cotización. Revise los datos.");
    }
}



async function ejecutarGuardar() {
  
    if (resultadoCalculos) {
        guardarCotizacion(resultadoCalculos);
        alert("Cotización guardada exitosamente.");
    } else {
        alert("Aún no se ha realizado ningún cálculo. Por favor presione Calcular primero.");
    }


}


function guardarCotizacion(datosCotizacion) {
      const cotizacionJSON = JSON.stringify(datosCotizacion);
    localStorage.setItem('ultimaCotizacion', cotizacionJSON);
}






//Esto es para que cuando recargue la pagina que siempre me llene los espacios

window.addEventListener('DOMContentLoaded', () => {
    cargarDatosGuardados();
});



function cargarDatosGuardados() {
    const cotizacionGuardada = localStorage.getItem('ultimaCotizacion');
    if (!cotizacionGuardada) return; 
    
    const datos = JSON.parse(cotizacionGuardada);

    
    resultadoCalculos = datos;


    if (datos.fechaRetiro) {
        document.querySelector('input[name="fechaRetiro"]').value = formatoFechaInput(datos.fechaRetiro);
    }
    if (datos.fechaDevolucion) {
        document.querySelector('input[name="fechadevolucion"]').value = formatoFechaInput(datos.fechaDevolucion);
    }

   
    if (datos.dias !== undefined) {
        document.getElementById("dias").value = datos.dias;
    }
    if (datos.tarifaDiaria !== undefined) {
        document.getElementById("td").value = datos.tarifaDiaria.toFixed(2);
    }
    if (datos.totalPagar !== undefined) {
        document.querySelector('input[name="totalPagar"]').value = datos.totalPagar.toFixed(2);
    }

    
    if (datos.cca3) {
        document.getElementById("nacionalidad").value = datos.cca3;
    }
}





function formatoFechaInput(fechaString) {
    const fecha = new Date(fechaString);
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

