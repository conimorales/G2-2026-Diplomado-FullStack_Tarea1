(function() {
    'use strict';

    var ITEMS_PER_PAGE = 10;
    var allData = [];
    var currentPage = 1;
    var editingId = null;

    var API_URL = 'data/project-list.json';

    function loadProjects() {
        fetch(API_URL)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Error al cargar los datos: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                allData = data;
                renderPage(currentPage);
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
    }

    function formatCLP(valor) {
        return valor.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        });
    }

    function renderTable(data) {
        var tbody = document.getElementById('projectsBody');
        tbody.innerHTML = '';

        data.forEach(function(item) {
            var row = document.createElement('tr');
            if (editingId === item.id) {
                row.innerHTML =
                    '<td>' + item.id + '</td>' +
                    '<td><input type="text" class="form-control form-control-sm" id="edit-proyecto" value="' + item.proyecto + '"></td>' +
                    '<td>' +
                    '<select class="form-select form-select-sm" id="edit-responsable">' +
                    '<option value="José"' + (item.responsable === 'José' ? ' selected' : '') + '>José</option>' +
                    '<option value="Coni"' + (item.responsable === 'Coni' ? ' selected' : '') + '>Coni</option>' +
                    '</select>' +
                    '</td>' +
                    '<td>' +
                    '<select class="form-select form-select-sm" id="edit-estado">' +
                    '<option value="Pendiente"' + (item.estado === 'Pendiente' ? ' selected' : '') + '>Pendiente</option>' +
                    '<option value="En desarrollo"' + (item.estado === 'En desarrollo' ? ' selected' : '') + '>En desarrollo</option>' +
                    '<option value="Finalizado"' + (item.estado === 'Finalizado' ? ' selected' : '') + '>Finalizado</option>' +
                    '</select>' +
                    '</td>' +
                    '<td><input type="number" class="form-control form-control-sm" id="edit-presupuesto" value="' + item.presupuesto_total + '"></td>' +
                    '<td>' +
                    '<button class="btn btn-success btn-sm" id="btn-save">Guardar</button> ' +
                    '<button class="btn btn-secondary btn-sm" id="btn-cancel">Cancelar</button>' +
                    '</td>';

                tbody.appendChild(row);

                document.getElementById('btn-save').onclick = function() {
                    guardarCambios(item.id);
                };
                document.getElementById('btn-cancel').onclick = function() {
                    editingId = null;
                    renderPage(currentPage);
                };
            } else {
                row.innerHTML =
                    '<td>' + item.id + '</td>' +
                    '<td>' + item.proyecto + '</td>' +
                    '<td>' + item.responsable + '</td>' +
                    '<td>' + item.estado + '</td>' +
                    '<td>' + formatCLP(item.presupuesto_total) + '</td>' +
                    '<td><button class="btn btn-outline-primary btn-sm">Editar</button></td>';

                tbody.appendChild(row);

                row.querySelector('button').onclick = function() {
                    editingId = item.id;
                    renderPage(currentPage);
                };
            }
        });
    }

    function guardarCambios(id) {
        var cambios = {
            proyecto: document.getElementById('edit-proyecto').value,
            responsable: document.getElementById('edit-responsable').value,
            estado: document.getElementById('edit-estado').value,
            presupuesto_total: parseInt(document.getElementById('edit-presupuesto').value, 10)
        };

        var index = allData.findIndex(function(p) { return p.id === id; });
        if (index !== -1) {
            allData[index] = Object.assign({}, allData[index], cambios);
        }

        editingId = null;
        renderPage(currentPage);
    }

    function renderPagination(totalItems) {
        var totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        var nav = document.getElementById('pagination');
        nav.innerHTML = '';

        var ul = document.createElement('ul');
        ul.className = 'pagination mb-0';

        function createItem(label, page, disabled, active) {
            var li = document.createElement('li');
            li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
            var a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = label;
            a.onclick = function(e) {
                e.preventDefault();
                if (!disabled) renderPage(page);
            };
            li.appendChild(a);
            return li;
        }

        ul.appendChild(createItem('Primero', 1, currentPage === 1, false));
        ul.appendChild(createItem('Anterior', currentPage - 1, currentPage === 1, false));

        for (var i = 1; i <= totalPages; i++) {
            ul.appendChild(createItem(i, i, false, i === currentPage));
        }

        ul.appendChild(createItem('Siguiente', currentPage + 1, currentPage === totalPages, false));
        ul.appendChild(createItem('Último', totalPages, currentPage === totalPages, false));

        nav.appendChild(ul);
    }

    function renderPage(page) {
        currentPage = page;
        var start = (page - 1) * ITEMS_PER_PAGE;
        var end = Math.min(start + ITEMS_PER_PAGE, allData.length);
        var pageData = allData.slice(start, end);

        renderTable(pageData);
        renderPagination(allData.length);

        var info = document.getElementById('pageInfo');
        info.textContent = 'Mostrando ' + (start + 1) + ' a ' + end + ' de ' + allData.length + ' registros';
    }

    loadProjects();

    var TableFilter = (function() {
        var Arr = Array.prototype;
        var input;

        function onInputEvent(e) {
            input = e.target;
            var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
            Arr.forEach.call(table1, function(table) {
                Arr.forEach.call(table.tBodies, function(tbody) {
                    Arr.forEach.call(tbody.rows, filter);
                });
            });
        }

        function filter(row) {
            var text = row.textContent.toLowerCase();
            var val = input.value.toLowerCase();
            row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
        }

        return {
            init: function() {
                var inputs = document.getElementsByClassName('csearch');
                Arr.forEach.call(inputs, function(input) {
                    input.oninput = onInputEvent;
                });
            }
        };
    })();

    TableFilter.init();
})();