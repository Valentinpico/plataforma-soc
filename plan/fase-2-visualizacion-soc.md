# Fase 2 — Aplicación web de visualización del SOC + prueba de modelos

**Proyecto:** PIS-24-09 — Plataforma SOC — EPN
**Período oficial:** 28 jun → 27 jul 2026
**Pago asociado:** $1.212 contra entrega del informe
**Depende de:** Fase 1 (backend, BD, grafo ya operativos)

---

## 1. Objetivo de la fase

Construir la capa visible: una **aplicación web interactiva** que muestre el SOC
sobre el territorio (visualización geoespacial) y permita **probar los modelos**
ya desarrollados por el equipo.

## 2. Alcance

### Sí entra
- Frontend React + TS con mapa interactivo del SOC en Ecuador.
- Capa geoespacial: visualización de estimaciones de SOC por región.
- Interfaz para ejecutar/consultar modelos (GNN/ML) y ver predicciones.
- Integración de los modelos existentes en el backend .NET (endpoints de inferencia).
- Validación operativa de la visualización y de la prueba de modelos.

### No entra
- RAG → Fase 3.
- Reentrenar modelos → ya entrenados por el equipo.

## 3. Stack (incremental sobre Fase 1)

| Capa | Tecnología |
|------|-----------|
| Frontend mapa | React + TS + **MapLibre GL** o **Leaflet** |
| Datos geoespaciales | GeoJSON / capas raster desde el backend |
| Backend inferencia | .NET expone endpoint; modelos Python vía sidecar si hace falta |
| BD | Postgres (reusa Fase 1) + PostGIS para geometría |

> Decisión de integración de modelos: si los GNN son Python, lo más limpio es
> un **microservicio Python de inferencia** que .NET consume por HTTP. No
> reescribir el modelo en C#.

## 4. Tareas principales

1. Habilitar PostGIS en Postgres + cargar geometrías de regiones.
2. Endpoint .NET que sirve estimaciones de SOC como GeoJSON.
3. Mapa interactivo en React (capas, leyenda, popups con valores SOC).
4. Endpoint de inferencia (.NET → sidecar Python si aplica) + UI de prueba de modelos.
5. Mostrar métricas de desempeño (R², MAE, MAPE) en la UI.
6. Validación operativa + capturas.
7. Redacción del informe.

## 5. Estructura del informe técnico

1. Portada (formato EPN, PIS-24-09)
2. Resumen ejecutivo
3. Objetivo del producto
4. Arquitectura de la aplicación de visualización (diagrama)
5. Visualización geoespacial del SOC (componentes, capas, fuentes de datos)
6. Integración y prueba de modelos (arquitectura, endpoints, flujo de inferencia)
7. Métricas y validación operativa
8. Tecnologías y decisiones técnicas
9. Conclusiones y enganche con Fase 3
10. Anexos: capturas, código, despliegue

## 6. Criterios de aceptación

- [ ] Mapa interactivo muestra SOC sobre Ecuador.
- [ ] Usuario puede ejecutar/consultar al menos un modelo y ver resultados.
- [ ] Métricas de desempeño visibles.
- [ ] Integración con el backend y BD de Fase 1.
- [ ] Informe completo con capturas reales.
