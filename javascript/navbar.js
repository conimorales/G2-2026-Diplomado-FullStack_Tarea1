(function aplicarTemaGuardado() {
    var temaGuardado = localStorage.getItem("tema") || "light";
    document.documentElement.setAttribute("data-theme", temaGuardado);
})();

fetch("componentes/navbar.html")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("navbar").innerHTML = data;
        inicializarToggleTema();
    });

function inicializarToggleTema() {
    var boton = document.getElementById("themeToggle");
    var icono = document.getElementById("themeIcon");
    if (!boton || !icono) return;

    function actualizarIcono() {
        var temaActual = document.documentElement.getAttribute("data-theme");
        icono.classList.toggle("fa-moon", temaActual !== "dark");
        icono.classList.toggle("fa-sun", temaActual === "dark");
    }

    actualizarIcono();

    boton.addEventListener("click", () => {
        var temaActual = document.documentElement.getAttribute("data-theme");
        var nuevoTema = temaActual === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nuevoTema);
        localStorage.setItem("tema", nuevoTema);
        actualizarIcono();
    });
}