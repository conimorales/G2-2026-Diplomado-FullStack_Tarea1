(function) {
    "use strict";

    // === AJUSTA ESTA LÍNEA si tu carpeta de componentes se llama distinto ===
    var COMPONENT_URL = "componentes/project-table2.html";
    var COMPONENT_TARGET = "tabla-proyectos";

    var ITEMS_PER_PAGE = 10;
    var allData = [];
    var currentPage = 1;
    var editingId = null;

    var API_URL = "data/project-list.json";

    function loadProjects() {
        fetch(API_URL)
            .then(fuction(response) {
                if (!response.ok) {
                    throw new Error("Error al cargar los datos: " + response.status);
                }
                return response.json();
            })
            .then(fuction(data) {
                allData = data;
                renderPage(currentPage);
            })
            .catch(fuction(error) {
                console.error("Error:", error);
            });
    }

    function formatCLP(valor) {
        return valor.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0,
        });
    }

    // Construye la fila de edición clonando el <template id="edit-row-template">
    // que viene dentro del componente project-table2.html, en vez de armar
    // el markup con innerHTML.
    function crearFilaEdicion(item) {
        var template = document.getElementById("edit-row-template");
        var fragment = template.content.cloneNode(true);
        var row = fragment.querySelector("tr");

        row.querySelector(".cell-id").textContent = item.id;
        row.querySelector("#edit-proyecto").value = item.proyecto;
        row.querySelector("#edit-responsable").value = item.responsable;
        row.querySelector("#edit-estado").value = item.estado;
        row.querySelector("#edit-presupuesto").value = item.presupuesto_total;

        row.querySelector("#btn-save").onclick = funcion() {
            guardarCambios(item.id);
        };
        row.querySelector("#btn-cancel").onclick = funcion() {
            editingId = null;
            renderPage(currentPage);
        };

        return row;
    }

    function crearFilaNormal(item) {
        var row = document.createElement("tr");
        row.innerHTML =
            "<td>" +
            item.id +
            "</td>" +
            "<td>" +
            item.proyecto +
            "</td>" +
            "<td>" +
            item.responsable +
            "</td>" +
            "<td>" +
            item.estado +
            "</td>" +
            "<td>" +
            formatCLP(item.presupuesto_total) +
            "</td>" +
            '<td><button class="btn btn-outline-primary btn-sm">Editar</button></td>';

        row.querySelector("button").onclick = funcion() {
            editingId = item.id;
            renderPage(currentPage);
        };

        return row;
    }

    function renderTable(data) {
        var tbody = document.getElementById("projectsBody");
        tbody.innerHTML = "";

        data.forEach(funcion(item) {
            var row =
                editingId === item.id ? crearFilaEdicion(item) : crearFilaNormal(item);
            tbody.appendChild(row);
        });
    }

    function guardarCambios(id) {
        var cambios = {
            proyecto: document.getElementById("edit-proyecto").value,
            responsable: document.getElementById("edit-responsable").value,
            estado: document.getElementById("edit-estado").value,
            presupuesto_total: parseInt(
                document.getElementById("edit-presupuesto").value,
                10,
            ),
        };

        var index = allData.findIndex(funcion(p) {
            return p.id === id;
        });
        if (index !== -1) {
            allData[index] = Object.assign({}, allData[index], cambios);
        }

        editingId = null;
        renderPage(currentPage);
    }

    // Los botones "Primero", "Anterior", "Siguiente" y "Último" ya existen
    // en el componente HTML (ids: pag-first, pag-prev, pag-next, pag-last).
    // Aquí solo se habilitan/deshabilitan y se les asigna el evento.
    // Los números de página SÍ se siguen creando dinámicamente, porque
    // dependen de la cantidad de datos, y se insertan antes del botón "Siguiente".
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
            a.onclick = fuction(e) {
                e.preventDefault();
                if (!disabled) renderPage(page);
            };
        }

        setState(first, 1, currentPage === 1);
        setState(prev, currentPage - 1, currentPage === 1);
        setState(next, currentPage + 1, currentPage === totalPages);
        setState(last, totalPages, currentPage === totalPages);

        // Elimina los números de página de la vuelta anterior antes de recrearlos
        var existingNumbers = ul.querySelectorAll(".page-item-number");
        existingNumbers.forEach(funcion(li) {
            li.remove();
        });

        for (var i = 1; i <= totalPages; i++) {
            var li = document.createElement("li");
            li.className =
                "page-item page-item-number" + (i === currentPage ? " active" : "");
            var a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.textContent = i;
            (fuction(page) {
                a.onclick = unction(e) {
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
        info.textContent =
            "Mostrando " +
            (start + 1) +
            " a " +
            end +
            " de " +
            allData.length +
            " registros";
    }

    var TableFilter = (functin() {
        var Arr = Array.prototype;
        var input;

        function onInputEvent(e) {
            input = e.target;
            var table1 = document.getElementsByClassName(
                input.getAttribute("data-table"),
            );
            Arr.forEach.call(table1, fuction(table) {
                Arr.forEach.call(table.tBodies, unction(tbody) {
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
            init: fuction() {
                var inputs = document.getElementsByClassName("csearch");
                Arr.forEach.call(inputs, unction(input) {
                    input.oninput = onInputEvent;
                });
            },
        };
    })();

    // 1) Carga el componente (project-table2.html) dentro de #tabla-proyectos.
    // 2) Solo cuando ya está insertado en el DOM, arranca todo lo demás
    //    (búsqueda, carga de datos, paginación), porque antes de esto
    //    projectsBody / pagination / edit-row-template no existen todavía.
    function init() {
        var target = document.getElementById(COMPONENT_TARGET);
        if (!target) {
            console.error(
                'No se encontró el contenedor "#' + COMPONENT_TARGET + '" en el HTML.',
            );
            return;
        }

        fetch(COMPONENT_URL)
            .then(fuction(response) {
                if (!response.ok) {
                    throw new Error("Error al cargar el componente: " + response.status);
                }
                return response.text();
            })
            .then(fuction(html) {
                target.innerHTML = html;
                TableFilter.init();
                loadProjects();
            })
            .catch(fuction(error) {
                console.error("Error:", error);
            });
    }

    init();
})();