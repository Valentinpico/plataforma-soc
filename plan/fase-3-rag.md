# Fase 3 — Sistema de consulta inteligente basado en RAG

**Proyecto:** PIS-24-09 — Plataforma SOC — EPN
**Período oficial:** 28 jul → 27 ago 2026
**Pago asociado:** $1.212 contra entrega del informe
**Depende de:** Fase 1 (repositorio + grafo) y Fase 2 (documentación generada)

---

## 1. Objetivo de la fase

Construir un sistema **RAG (Retrieval-Augmented Generation)** que permita
consultar en lenguaje natural la información técnica del proyecto: documentación,
informes, metodología, resultados, y el grafo de conocimiento.

## 2. Qué consume el RAG (importante)

RAG **no** consulta los datos numéricos geoespaciales crudos (Sentinel, SOC,
coordenadas). Consume **texto**: informes de las 3 fases, documentación técnica,
metadatos del repositorio y relaciones del grafo de conocimiento.

Por eso esta fase va al final: necesita la documentación que las fases 1 y 2
generaron.

## 3. Alcance

### Sí entra
- Pipeline RAG: ingestión de documentos → chunking → embeddings → vector store.
- Recuperación semántica sobre la base documental del proyecto.
- Generación de respuestas con LLM citando las fuentes.
- (Opcional, suma valor) recuperación apoyada en el grafo de conocimiento (GraphRAG ligero).
- Interfaz de consulta en el frontend existente.
- Evaluación de desempeño del sistema.

### No entra
- Reescribir backend o frontend → se extienden los existentes.

## 4. Stack (incremental)

| Componente | Tecnología |
|------------|-----------|
| Orquestación RAG | **Semantic Kernel** (.NET) |
| Vector store | **pgvector** sobre el Postgres existente |
| Embeddings + LLM | API externa (OpenAI / Azure OpenAI / Gemini) |
| Fuente de contexto | docs del repositorio (Fase 1) + grafo Neo4j |
| UI | extensión del frontend React de Fase 2 |

> .NET es viable para RAG vía Semantic Kernel. Si aparece un cuello de botella
> con embeddings, un microservicio Python chico es el plan B; no se necesita de entrada.

## 5. Tareas principales

1. Habilitar `pgvector` en Postgres.
2. Pipeline de ingestión: leer docs del repositorio → chunking → embeddings → guardar vectores.
3. Servicio de retrieval (búsqueda por similitud) en .NET con Semantic Kernel.
4. Generación de respuesta con LLM + citado de fuentes.
5. (Opcional) enriquecer el contexto con consultas al grafo de conocimiento.
6. UI de chat/consulta en el frontend.
7. Evaluación: conjunto de preguntas de prueba, medición de relevancia/precisión.
8. Redacción del informe.

## 6. Estructura del informe técnico

1. Portada (formato EPN, PIS-24-09)
2. Resumen ejecutivo
3. Objetivo del producto
4. Fundamento de RAG y justificación de la arquitectura
5. Fuentes de información y proceso de ingestión
6. Mecanismos de recuperación (embeddings, vector store, búsqueda)
7. Generación de respuestas y citado de fuentes
8. (Opcional) integración con el grafo de conocimiento
9. Evaluación de desempeño (métricas, casos de prueba)
10. Tecnologías y decisiones técnicas
11. Conclusiones generales del proyecto (cierre de las 3 fases)
12. Anexos: capturas, código, despliegue

## 7. Criterios de aceptación

- [ ] Pipeline de ingestión funcional sobre la documentación del proyecto.
- [ ] Recuperación semántica devuelve fragmentos relevantes.
- [ ] Respuestas generadas citan las fuentes.
- [ ] UI de consulta integrada en la plataforma.
- [ ] Evaluación documentada con casos de prueba.
- [ ] Informe completo cerrando el ciclo del proyecto.
