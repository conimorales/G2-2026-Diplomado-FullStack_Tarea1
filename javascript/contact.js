const formulario = document.querySelector("form");
const mensaje = document.getElementById("mensajeConfirmacion");
const btnCancelar = document.querySelector("button[type='reset']");

formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // evita que la página se recargue

    console.log("Formulario enviado ✅", {
        correo: document.getElementById("correo").value,
        modulo: document.getElementById("modulo").value,
        sistema: document.getElementById("sistema").value,
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value
    });

    mensaje.classList.remove("d-none"); // cambio visible en el DOM
    formulario.reset();
});
btnCancelar.addEventListener("click", () => {
    console.log("Cancelar presionado, limpiando formulario...");
    formulario.reset();
    mensaje.classList.add("d-none");
    /* se usa para ocultar un elemento web por completo, oculta el mensaje de envío */
});