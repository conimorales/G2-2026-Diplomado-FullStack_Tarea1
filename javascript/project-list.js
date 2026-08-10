// renderiza la tabla html
// fetch fx de js que manda archivos al js
fetch("componentes/project-table.html")
    .then(response => response.text())
    .then(data => {
        // agrega la información llamada por el id
        document.getElementById("tabla-proyectos").innerHTML = data;

        // Crea la datatable y la guarda en la variable
        const tabla = new DataTable("#tablaProyectos", {
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            },
            ajax: {
                url: "./data/project-list.json",
                dataSrc: ""
            },
            columns: [
                { data: "id" },
                { data: "proyecto" },
                { data: "responsable" },
                { data: "estado" },
                { data: "presupuesto_total" }
            ],

            // se ejecuta cuando la tabla haya terminado de cargar 
            initComplete: function() {
                const filtro = document.getElementById("filtroEstado");
                // crea el fitro del estado de los proyectos

                if (filtro) {
                    // filtramos por estado
                    filtro.addEventListener("change", (e) => {
                        tabla.column(3).search(e.target.value).draw();
                    });
                }
            }
        });

    })
    .catch(error => {
        console.error("Error cargando la tabla de proyectos:", error);
    });