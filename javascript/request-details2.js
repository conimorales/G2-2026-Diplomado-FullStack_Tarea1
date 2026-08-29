(function() {
    "use strict";

    var COMPONENT_URL = "componentes/detail-table.html";
    var COMPONENT_TARGET = "tabla-detalle-solicitudes";

    var ITEMS_PER_PAGE = 10;
    var allData = [];
    var currentPage = 1;

    // === Antes: var API_URL = "data/request-details.json"; ===
    // Ahora consumimos JSONPlaceholder (API de prueba, sin key)
    var API_URL = "https://jsonplaceholder.typicode.com/posts";

    // JSONPlaceholder no tiene sistema/cer/estado/fechaCreacion,
    // así que los simulamos a partir del id del post.
    var SISTEMAS = ["SAP", "Power BI", "SIGA"];
    var ESTADOS = ["En proceso", "Finalizado"];

    function fechaSimulada(id) {
        // Genera fechas incrementales a partir de 2026-07-01, solo para tener algo coherente
        var fecha = new Date(2026, 6, 1);
        fecha.setDate(fecha.getDate() + id);
        return fecha.toISOString().slice(0, 10); // formato YYYY-MM-DD
    }

    function mapPost(post) {
        return {
            id: post.id,
            nombre: post.title,
            descripcion: post.body,
            sistema: SISTEMAS[post.id % SISTEMAS.length],
            cer: "12" + (30 + post.id),
            estado: ESTADOS[post.id % ESTADOS.length],
            impactoFinanciero: post.id % 2 === 0,
            fechaCreacion: fechaSimulada(post.id),
        };
    }

    function showLoading() {
        var loading = document.getElementById("loadingState");
        var error = document.getElementById("errorState");
        var wrapper = document.getElementById("tableWrapper");
        var footer = document.getElementById("paginationFooter");

        if (loading) loading.classList.remove("d-none");
        if (error) error.classList.add("d-none");
        if (wrapper) wrapper.classList.add("d-none");
        if (footer) footer.classList.add("d-none");
    }

    function showTable() {
        var loading = document.getElementById("loadingState");
        var error = document.getElementById("errorState");
        var wrapper = document.getElementById("tableWrapper");
        var footer = document.getElementById("paginationFooter");

        if (loading) loading.classList.add("d-none");
        if (error) error.classList.add("d-none");
        if (wrapper) wrapper.classList.remove("d-none");
        if (footer) footer.classList.remove("d-none");
    }

    function showError(mensaje) {
        var loading = document.getElementById("loadingState");
        var error = document.getElementById("errorState");
        var wrapper = document.getElementById("tableWrapper");
        var footer = document.getElementById("paginationFooter");

        if (loading) loading.classList.add("d-none");
        if (wrapper) wrapper.classList.add("d-none");
        if (footer) footer.classList.add("d-none");
        if (error) {
            error.textContent = mensaje;
            error.classList.remove("d-none");
        }
    }

    function loadProjects() {
        showLoading();

        fetch(API_URL)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Error al cargar los datos: " + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                allData = data.map(mapPost);
                showTable();
                renderPage(currentPage);
            })
            .catch(function(error) {
                console.error("Error:", error);
                showError("No se pudieron cargar las solicitudes. Ocurrió un error al cargar los datos.");
            });
    }

    function formatImpacto(valor) {
        return valor ? "Sí" : "No";
    }

    // === AJUSTA los nombres de propiedad (item.xxx) si tu JSON usa otros nombres ===
    function crearFilaNormal(item) {
        var row = document.createElement("tr");
        row.innerHTML =
            "<td>" + item.id + "</td>" +
            "<td>" + item.nombre + "</td>" +
            "<td>" + item.descripcion + "</td>" +
            "<td>" + item.sistema + "</td>" +
            "<td>" + item.cer + "</td>" +
            "<td>" + item.estado + "</td>" +
            "<td>" + formatImpacto(item.impactoFinanciero) + "</td>" +
            "<td>" + item.fechaCreacion + "</td>";
        return row;
    }

    function renderTable(data) {
        var tbody = document.getElementById("projectsBody2");
        tbody.innerHTML = "";

        data.forEach(function(item) {
            tbody.appendChild(crearFilaNormal(item));
        });
    }

    function renderPagination(totalItems) {
        var totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        var ul = document.getElementById("pagination");
        var first = document.getElementById("pag-first");
        var prev = document.getElementById("pag-prev");
        var next = document.getElementById("pag-next");
        var last = document.getElementById("pag-last");

        function setState(li, page, disabled) {
            li.className = "page-item" + (disabled ? " disabled" : "");
            var a = li.querySelector("a");
            a.onclick = function(e) {
                e.preventDefault();
                if (!disabled) renderPage(page);
            };
        }

        setState(first, 1, currentPage === 1);
        setState(prev, currentPage - 1, currentPage === 1);
        setState(next, currentPage + 1, currentPage === totalPages);
        setState(last, totalPages, currentPage === totalPages);

        var existingNumbers = ul.querySelectorAll(".page-item-number");
        existingNumbers.forEach(function(li) {
            li.remove();
        });

        for (var i = 1; i <= totalPages; i++) {
            var li = document.createElement("li");
            li.className = "page-item page-item-number" + (i === currentPage ? " active" : "");
            var a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.textContent = i;
            (function(page) {
                a.onclick = function(e) {
                    e.preventDefault();
                    renderPage(page);
                };
            })(i);
            li.appendChild(a);
            ul.insertBefore(li, next);
        }
    }

    function renderPage(page) {
        currentPage = page;
        var start = (page - 1) * ITEMS_PER_PAGE;
        var end = Math.min(start + ITEMS_PER_PAGE, allData.length);
        var pageData = allData.slice(start, end);

        renderTable(pageData);
        renderPagination(allData.length);

        var info = document.getElementById("pageInfo");
        info.textContent = "Mostrando " + (start + 1) + " a " + end + " de " + allData.length + " registros";
    }

    var TableFilter = (function() {
        var Arr = Array.prototype;
        var input;

        function onInputEvent(e) {
            input = e.target;
            var table1 = document.getElementsByClassName(input.getAttribute("data-table"));
            Arr.forEach.call(table1, function(table) {
                Arr.forEach.call(table.tBodies, function(tbody) {
                    Arr.forEach.call(tbody.rows, filter);
                });
            });
        }

        function filter(row) {
            var text = row.textContent.toLowerCase();
            var val = input.value.toLowerCase();
            row.style.display = text.indexOf(val) === -1 ? "none" : "table-row";
        }

        return {
            init: function() {
                var inputs = document.getElementsByClassName("csearch");
                Arr.forEach.call(inputs, function(input) {
                    input.oninput = onInputEvent;
                });
            },
        };
    })();

    function init() {
        var target = document.getElementById(COMPONENT_TARGET);
        if (!target) {
            console.error('No se encontró el contenedor "#' + COMPONENT_TARGET + '" en el HTML.');
            return;
        }

        fetch(COMPONENT_URL)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Error al cargar el componente: " + response.status);
                }
                return response.text();
            })
            .then(function(html) {
                target.innerHTML = html;
                TableFilter.init();
                loadProjects();
            })
            .catch(function(error) {
                console.error("Error:", error);
            });
    }

    init();
})();