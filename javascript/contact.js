const formulario = document.querySelector("form");
const mensaje = document.getElementById("mensajeConfirmacion");
const btnCancelar = document.querySelector("button[type='reset']");

// Reglas de validación : cada campo tiene una función que devuelve
// el mensaje de error, o null si el valor es válido.
const reglas = {
    correo: (valor) => {
        if (!valor.trim()) return "El correo es obligatorio.";
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor.trim()))
            return "Ingresa un correo válido (ej: usuario@empresa.cl).";
        return null;
    },
    modulo: (valor) => {
        if (!valor) return "Selecciona un módulo.";
        return null;
    },
    sistema: (valor) => {
        if (!valor) return "Selecciona un sistema.";
        return null;
    },
    nombre: (valor) => {
        if (!valor.trim()) return "El detalle de la solicitud es obligatoria.";
        if (valor.trim().length < 5)
            return "El detalle de la solicitud debe tener al menos 5 caracteres.";
        return null;
    },
    descripcion: (valor) => {
        if (!valor.trim()) return "La descripción es obligatoria.";
        if (valor.trim().length < 15)
            return "Describe con más detalle (mínimo 15 caracteres).";
        return null;
    },
};

// Busca (o crea) el <div class="invalid-feedback"> justo después del campo
function obtenerContenedorError(campo) {
    let siguiente = campo.nextElementSibling;
    if (siguiente && siguiente.classList.contains("invalid-feedback")) {
        return siguiente;
    }
    const div = document.createElement("div");
    div.classList.add("invalid-feedback");
    campo.insertAdjacentElement("afterend", div);
    return div;
}

function mostrarError(campo, texto) {
    campo.classList.add("is-invalid");
    obtenerContenedorError(campo).textContent = texto;
}

function limpiarError(campo) {
    campo.classList.remove("is-invalid");
    obtenerContenedorError(campo).textContent = "";
}

function validarCampo(campo) {
    const regla = reglas[campo.id];
    if (!regla) return true;

    const error = regla(campo.value);
    if (error) {
        mostrarError(campo, error);
        return false;
    }
    limpiarError(campo);
    return true;
}

// Valida en vivo una vez que el campo ya fue tocado
Object.keys(reglas).forEach((id) => {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
        if (campo.classList.contains("is-invalid")) validarCampo(campo);
    });
    campo.addEventListener("change", () => {
        if (campo.classList.contains("is-invalid")) validarCampo(campo);
    });
});

formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // evita que la página se recargue

    // Valida todos los campos antes de enviar
    let formularioValido = true;
    Object.keys(reglas).forEach((id) => {
        const campo = document.getElementById(id);
        if (!campo) return;
        if (!validarCampo(campo)) formularioValido = false;
    });

    if (!formularioValido) {
        const primerError = formulario.querySelector(".is-invalid");
        if (primerError) primerError.focus();
        return; // no envía si hay errores
    }

    console.log("Formulario enviado ✅", {
        correo: document.getElementById("correo").value,
        modulo: document.getElementById("modulo").value,
        sistema: document.getElementById("sistema").value,
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
    });

    mensaje.classList.remove("d-none"); // cambio visible en el DOM
    formulario.reset();
    Object.keys(reglas).forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) campo.classList.remove("is-invalid");
    });
});

btnCancelar.addEventListener("click", () => {
    console.log("Cancelar presionado, limpiando formulario...");
    formulario.reset();
    mensaje.classList.add("d-none");
    Object.keys(reglas).forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) campo.classList.remove("is-invalid");
    });
    /* se usa para ocultar un elemento web por completo, oculta el mensaje de envío */
});