document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("nacionalidad");
  const nacionalidadGuardada = localStorage.getItem("nacionalidad") || "CRI";

  try {
    // Pedimos name, translations y cca3
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,translations,cca3"
    );
    const paises = await response.json();

    // Ordenar usando nombre en español si está disponible
    paises.sort((a, b) => {
      const nombreA = a.translations?.spa?.common || a.name.common;
      const nombreB = b.translations?.spa?.common || b.name.common;
      return nombreA.localeCompare(nombreB);
    });

    paises.forEach((pais) => {
      const nombre = pais.translations?.spa?.common || pais.name.common;
      const value = pais.cca3; // Ahora sí existe

      const option = document.createElement("option");
      option.value = value;
      option.textContent = nombre;

      if (value === nacionalidadGuardada) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    // Guardar cambios en localStorage
    select.addEventListener("change", () => {
      localStorage.setItem("nacionalidad", select.value);
    });
  } catch (error) {
    console.error("Error cargando los países:", error);
  }
});


