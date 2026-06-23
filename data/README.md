# data/ — Material real del proyecto

Fuente de verdad de los assets del proyecto SOC (PIS-24-09). Organizado por tipo,
no por semestre. El backend referencia estos paths desde el seeder.

```
data/
├── soc/                  → mediciones de carbono orgánico del suelo
│   ├── soc-ecuador-2021.csv             (12.861 perfiles crudos)
│   └── soc-ecuador-2021-procesado.xlsx  (11.112 filas con lon/lat + outliers)
├── geo/                  → geometrías para visualización (Fase 2)
│   ├── ecuador-adm1/                     (geoBoundaries, 24 provincias)
│   └── ecuador-continental/             (full_prov2 shapefile)
├── modelos/              → modelos GNN del proyecto
│   ├── notebooks/                        (GraphSAGE, GAT, GATv2 — .ipynb)
│   └── esquemas/                         (diagramas inductivo/transductivo)
├── documentos/           → documentación
│   ├── informes/                         (informes técnicos firmados)
│   └── oficios-inamhi/                  (solicitud + respuesta de datos SOC)
└── _archivos/            → .rar redundantes (contenido ya extraído)
```

Notas:
- Copiado desde la carpeta `Productos/` original (ya eliminada).
- Se deduplicaron 2 imágenes de esquema repetidas entre productos.
- Métricas reales de los modelos (R²/MAE/MAPE) están en los informes de
  `documentos/informes/` — falta volcarlas a la tabla `Results`.
