# G2-2026-Diplomado-FullStack

> Proyecto del Módulo 1 — HTML + CSS + JS · Diplomado Fullstack IPSS

## Integrantes

- Constanza Morales
- [Nombre 2]


## Descripción

Plataforma de gestión de proyectos TI: permite clasificar requerimientos, seguir el avance de cada CER y controlar el presupuesto asignado versus utilizado de cada proyecto, desde que se crea la solicitud hasta que se cierra.

## Páginas

### Home
"Plataforma de gestión de proyectos TI" 
Explica cuales proyectos se van a considerar por su clasificación
Incluye 2-3 cards destacando categorías (Nuevo Proyecto CAPEX, Mejora OPEX, Soporte).

### Listado de proyectos
Tabla con: ID, Proyecto, Sistema, Estado, Proveedor, Presupuesto asignado.
- Filtros por Estado (En proceso / Finalizado), Sistema (SIGA / SPEX / etc.) y Proveedor.
- Barra de búsqueda por nombre de proyecto.

### Detalle
Ficha completa de un proyecto: descripción, CER, fechas, presupuesto asignado vs. utilizado, si tiene impacto financiero, tipo (mejora o funcionalidad nueva).

### Contacto este se considero como un ingreso de solicitud 
Formulario simple (nombre, email, mensaje).



## Cómo correr localmente

Este proyecto usa `fetch()` para cargar componentes (navbar, footer, tabla), por lo que **no funciona abriendo los archivos directamente con doble clic** — necesitas un servidor local.
Pasos a seguir:
1. git clone https://github.com/conimorales/G2-2026-Diplomado-FullStack_Tarea1.git
2.  cd G2-2026-Diplomado-FullStack_Tarea1
3. Luego abre `http://localhost:8000/home.html` en el navegador.

Alternativa: si usas VS Code, instala la extensión **Live Server**, clic derecho sobre `home.html` → "Open with Live Server".

## Estructura del proyecto
├── home.html
├── listado-proyectos.html
├── detalle-proyecto.html
├── contacto.html
├── componentes/
│ ├── navbar.html
│ ├── footer.html
│ └── tabla-proyectos.html
├── css/
│ └── base.css ← CSS propio, cargado DESPUÉS de Bootstrap
├── javascript/
│ ├── navbar.js
│ ├── footer.js
│ └── proyectos.js ← Eventos y JS propio
├── data/
│ └── proyecto.json
└── img/