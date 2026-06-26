# INFORME MENSUAL DE PRODUCTOS ENTREGADOS

> Documento corto (formato administrativo). El detalle técnico está en
> `informe-tecnico-producto-1.md`. Campos `[COMPLETAR: ...]` pendientes.

| Campo | Valor |
|-------|-------|
| **NOMBRE DEL PRODUCTO** | Implementación de un aplicativo web para la gestión de información sobre carbono orgánico del suelo, datos geoespaciales y sostenibilidad de suelos, con generación de un grafo de conocimiento soportado en base de datos. |
| **CÓDIGO PROYECTO** | PIS-24-09 |
| **NOMBRE DE PROYECTO** | Estimación del Carbono Orgánico del Suelo mediante Redes Neuronales de Grafos utilizando Datos Multimodales Geoespaciales |
| **NOMBRE DEL PROFESIONAL** | Valentin Pico — Ingeniero de Software |
| **PERÍODO** | 28 de mayo de 2026 al 27 de junio de 2026 |
| **FECHA DE PRESENTACIÓN** | [COMPLETAR: fecha de entrega] |

---

## 1. OBJETIVO

Diseñar e implementar un aplicativo web para la gestión de la información del Proyecto
PIS-24-09, que integre un repositorio digital y un grafo de conocimiento soportado en
base de datos, garantizando la organización, trazabilidad y reproducibilidad de los
datos, modelos, resultados y documentación relacionados con la estimación del Carbono
Orgánico del Suelo (SOC) en Ecuador.

## 2. ACTIVIDADES REALIZADAS

Durante el período se desarrollaron las siguientes actividades:

1. Definición de la arquitectura de la plataforma (backend por capas, frontend por
   features, monorepo único) y configuración del entorno en contenedores
   (PostgreSQL/PostGIS, Neo4j, API .NET 9 y frontend React) con Docker Compose.
2. Diseño e implementación del modelo de datos del repositorio (seis entidades) con
   Entity Framework Core sobre PostgreSQL, y del grafo de conocimiento en Neo4j con sus
   relaciones (PROVIENE_DE, CONTIENE, ENTRENADO_CON, PRODUCE, DOCUMENTA).
3. Desarrollo de la API de gestión del repositorio con validación de dominio y manejo
   centralizado de errores; carga del repositorio con la información real del proyecto
   (fuentes, datasets, variables, modelos GNN, resultados y documentos).
4. Desarrollo de la **página principal del Grupo de Investigación META**: identidad del
   grupo, líneas de investigación por departamento, ámbitos de interés, equipo y
   proyectos, con identidad institucional de la EPN.
5. Implementación de los **perfiles de investigador**: adscripción, correo
   institucional, experiencia en proyectos, publicaciones (clasificadas por área y
   enlazadas a su DOI) y un **grafo de conocimiento individual** por investigador.
6. **Clasificación automática de la producción científica** del equipo en áreas
   temáticas y vista de "investigaciones por área".
7. Desarrollo de la **página del proyecto SOC** en una vista única (sin pestañas):
   equipo del proyecto, indicadores, grafo de conocimiento con filtro por tipo de nodo,
   datos (datasets, variables y fuentes), modelos GNN con métricas y documentos
   descargables.
8. Implementación del modo administración (control de acceso por contraseña, lectura
   pública por defecto) y de pruebas automatizadas (TDD) para backend y frontend.
9. Control de versiones (Git) con commits atómicos.

## 3. PRODUCTOS ALCANZADOS

1. Aplicativo web de gestión de información (repositorio digital) con la página del
   grupo de investigación, perfiles de investigadores y la página del proyecto SOC.
2. Grafo de conocimiento soportado en base de datos (Neo4j) que relaciona datos
   geoespaciales, variables ambientales, modelos, resultados, documentación y fuentes;
   y grafos de conocimiento individuales por investigador derivados de su producción.
3. Modelo de datos y base de datos del repositorio (PostgreSQL), poblada con
   información real del proyecto.
4. Clasificación de la producción científica del equipo por áreas temáticas.
5. Infraestructura reproducible en contenedores (Docker Compose).
6. Documentación técnica del producto (informe técnico detallado, modelo de datos,
   convenciones y despliegue).

### Evidencias

- [INSERTAR CAPTURA: página principal del Grupo META]
- [INSERTAR CAPTURA: perfil de investigador con grafo de conocimiento]
- [INSERTAR CAPTURA: proyecto SOC — vista única (equipo, grafo, datos, modelos)]
- [INSERTAR CAPTURA: grafo en Neo4j Browser]

## 4. REFERENCIAS

- Instituto Nacional de Meteorología e Hidrología (INAMHI). (2021). *Base de datos de
  mediciones de Carbono Orgánico del Suelo del Ecuador continental* (MAGAP).
- Soliz Villafuerte, M. X., & Donoso Vargas, D. A. (2026). *Informe de Implementación en
  Python de la Arquitectura Óptima para la Estimación y Predicción del SOC* (Producto 2,
  PIS-24-09). Escuela Politécnica Nacional.

## 5. CONCLUSIONES

- La implementación del repositorio digital y del grafo de conocimiento permite
  centralizar, organizar y relacionar de forma trazable los activos del proyecto,
  facilitando su consulta y reutilización.
- La plataforma, además del catálogo del proyecto SOC, presenta al grupo de
  investigación y a sus integrantes, y clasifica la producción científica por áreas,
  integrando la información en una sola aplicación navegable.
- La arquitectura por capas y la ejecución en contenedores garantizan reproducibilidad,
  escalabilidad y mantenibilidad, sentando la base para las fases de visualización del
  SOC y de consulta inteligente (RAG).

## 6. ACEPTACIÓN

Firma Valentin Pico en calidad de profesional contratado del Proyecto PIS-24-09 y el
director del Proyecto David Andrés Donoso Vargas, en calidad de director del Proyecto
PIS-24-09, para constancia de la recepción de este producto y su aprobación a entera
satisfacción.

| Elaborado por: | Aprobado por: |
|----------------|---------------|
| [COMPLETAR: firma electrónica] | |
| **Nombre:** Valentin Pico | **Nombre:** David Andrés Donoso Vargas |
| Ingeniero de Software — Profesional contratado PIS-24-09 | Director del Proyecto PIS-24-09 |
