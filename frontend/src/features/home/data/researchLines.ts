// Líneas de investigación del grupo META — aprobadas por el Consejo de
// Investigación, Innovación y Vinculación (fuente: registro del grupo).
// Las descripciones son breves y neutrales; ajustar con el texto oficial si se requiere.

export interface ResearchLine {
  code: string;
  name: string;
  department: string;
  blurb: string;
}

export const researchLines: ResearchLine[] = [
  {
    code: "LPI-DM-2023-04",
    name: "Modelización Estocástica Teórica y Aplicada",
    department: "Departamento de Matemática",
    blurb:
      "Modelos probabilísticos y estadística avanzada para representar incertidumbre y dinámica en sistemas complejos.",
  },
  {
    code: "LI-DB-2023-02",
    name: "Ecología",
    department: "Departamento de Biología",
    blurb:
      "Estudio de ecosistemas y procesos ecológicos, base ambiental del proyecto de carbono orgánico del suelo (SOC).",
  },
  {
    code: "LI-DICA-2023-01",
    name: "Geografía y Paisaje",
    department: "Departamento de Ingeniería Civil y Ambiental",
    blurb:
      "Análisis territorial y del paisaje a partir de datos geoespaciales y cambio de uso del suelo.",
  },
  {
    code: "LI-DICA-2023-06",
    name: "Meteorología y Climatología Aplicada",
    department: "Departamento de Ingeniería Civil y Ambiental",
    blurb:
      "Caracterización de variables climáticas y meteorológicas aplicadas al estudio de procesos ambientales.",
  },
  {
    code: "LPI-DICA-2023-01",
    name: "Hidrología, Hidrogeología y Recursos Hídricos",
    department: "Departamento de Ingeniería Civil y Ambiental",
    blurb:
      "Modelización de recursos hídricos y procesos hidrológicos bajo variabilidad e incertidumbre.",
  },
];
