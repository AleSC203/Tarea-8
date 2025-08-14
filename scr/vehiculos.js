let vehiculosData = null;


async function cargarVehiculos() {
    try {
        const respuesta = await fetch("VehiculosDatos.json");
        vehiculosData = await respuesta.json();
    } catch (error) {
        alert("Error al cargar datos de vehículos: " + error);
    }
}

// Función que muestra imágenes y descripciones según selección
function mostrarTodo() {
    /*  if (!vehiculosData) {
        console.log("Datos no cargados aún.");
        return;
    } */

    const tipoVehiculo = document.getElementById("tipoVehiculo");
    const seleccion = tipoVehiculo.options[tipoVehiculo.selectedIndex].text.toLowerCase();


    let clave = "";
    if (seleccion.includes("compacto")) clave = "compactos";
    else if (seleccion.includes("mediano")) clave = "medianos";
    else if (seleccion.includes("todo terreno") || seleccion.includes("todo terren")) clave = "todoTerrenos";
    else if (seleccion.includes("familiar")) clave = "familiares";

    /*   if (!clave || !vehiculosData[clave]) {
        console.log("Tipo de vehículo no reconocido");
        return;
    } */

    //Aqui lista vehiculos ya es el arreglo con los tres carroos segun el tipo de clave
    const listaVehiculos = vehiculosData[clave];

    // Mostrar imágenes y descripciones
    for (let i = 0; i < 3; i++) {
        const img = document.getElementById("img" + (i + 1));
        if (listaVehiculos[i]) {
            img.src = "images/" + listaVehiculos[i].imagen;
            img.alt = listaVehiculos[i].descripcion;

        } else {
            img.src = "";
            img.alt = "No Disponible";
        
        }
    }



    //Esto es parte de la imagen Grande

    // Mostrar descripción del primer vehículo como info general
    const infoCar = document.getElementById("infTCar");
    
    if (listaVehiculos[0]) {
        infoCar.textContent = listaVehiculos[0].descripcion;
    } else {
        infoCar.textContent = "No hay vehículos disponibles";
    }

    // Mostrar primera imagen grande
    mostrarImagen(1);
}
1


// Función para mostrar imagen grande según número
function mostrarImagen(num) {
    const tipoVehiculo = document.getElementById("tipoVehiculo");
    const seleccion = tipoVehiculo.options[tipoVehiculo.selectedIndex].text.toLowerCase();

    
    let clave = "";
    if (seleccion.includes("compacto")) clave = "compactos";
    else if (seleccion.includes("mediano")) clave = "medianos";
    else if (seleccion.includes("todo terreno") || seleccion.includes("todo terren")) clave = "todoTerrenos";
    else if (seleccion.includes("familiar")) clave = "familiares";

    if (!clave || !vehiculosData[clave]) return;

    const listaVehiculos = vehiculosData[clave];
    const imgGrande = document.getElementById("imgVista");

    if (listaVehiculos[num - 1]) {
        imgGrande.src = "images/" + listaVehiculos[num - 1].imagen;
        imgGrande.alt = listaVehiculos[num - 1].descripcion;

        // También actualizar la descripción 
        document.getElementById("infTCar").textContent = listaVehiculos[num - 1].descripcion;
    }
}

// Cargar datos y mostrar al cargar página
document.addEventListener("DOMContentLoaded", async () => {
    await cargarVehiculos();
    mostrarTodo();
});






function MensajeTipoSeguro() {
    const seguroSeleccionado = document.getElementById("seguro");
    const tipo = seguroSeleccionado.options[seguroSeleccionado.selectedIndex].id;

    let mensaje = "";

    switch (tipo) {
        case "PBO":
            mensaje = "Protección Básica Obligatoria (PBO)\n" +
                      "Cubre daños al vehículo rentado y daños a vehículos terceros involucrados en un accidente de tránsito.\n" +
                      "Costo de alquiler diario: $5.45 por día.";
            break;
        case "PED":
            mensaje = "Protección Extendida de Daños (PED)\n" +
                      "Cubre la Protección Básica Obligatoria (PBO) más daños a propiedades de terceros, incendio e inundaciones.\n" +
                      "Costo de alquiler diario: $9.50 por día.";
            break;
        case "PGM":
            mensaje = "Protección Gastos Médicos (PGM)\n" +
                      "Cubre la Protección Extendida de Daños (PED) más gastos médicos para los ocupantes del vehículo.\n" +
                      "Costo de alquiler diario: $11.25 por día.";
            break;
    }

    alert(mensaje);
}