fetch("componentes/tabla-proyectos.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("tabla-proyectos").innerHTML = data;

        new DataTable("#tablaProyectos", {
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            },
            ajax: {
                url: "./data/proyectos.json",
                dataSrc: "" // el JSON es un array plano [ {...}, {...} ], no { data: [...] }
            },
            columns: [
                    { data: "id" },
                    { data: "proyecto" },
                    { data: "responsable" },
                    { data: "estado" },
                    { data: "presupuesto_total" }
                ]
                /*        , layout: {
                                    topStart: {
                                        buttons: [
                                            { extend: 'create', editor: editor },
                                            { extend: 'edit', editor: editor },
                                            { extend: 'remove', editor: editor }
                                        ]
                                    }
                } */
        });
    })
    .catch(error => {
        console.error("Error cargando la tabla de proyectos:", error);
    });