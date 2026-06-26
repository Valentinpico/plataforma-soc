// Categorías temáticas para clasificar la producción científica del grupo.

export interface ResearchCategory { id: string; name: string; }

export const researchCategories: ResearchCategory[] = [
  { id: "ambiental", name: "Ambiental" },
  { id: "ecologia", name: "Ecología" },
  { id: "suelo", name: "Uso de suelo" },
  { id: "geoespacial", name: "Datos geoespaciales" },
  { id: "hidrologia", name: "Hidrología" },
  { id: "clima", name: "Meteorología y clima" },
  { id: "estadistica", name: "Estadística y modelización" },
  { id: "series", name: "Series temporales" },
  { id: "economia", name: "Economía y finanzas" },
  { id: "ia", name: "IA y aprendizaje automático" },
  { id: "materiales", name: "Materiales y metrología" },
  { id: "iot_seguridad", name: "IoT y seguridad" },
  { id: "politica", name: "Política pública y social" },
];

export const categoryName = (id: string): string =>
  researchCategories.find((c) => c.id === id)?.name ?? id;
