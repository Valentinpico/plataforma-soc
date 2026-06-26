// Roster del grupo de investigación META (Departamento de Matemática, EPN).

export interface Paper {
  title: string;
  year: number;
  summary: string;
  file?: string; // PDF descargable si está disponible
  topics: string[]; // alimentan el grafo de conocimiento de la persona
}

export interface Researcher {
  id: string; // slug, p.ej. "miguel-flores"
  fullName: string;
  degree: "PhD" | "MSc" | "BSc";
  role: "Coordinador" | "Miembro" | "Colaborador";
  affiliation: string;
  lines: string[]; // códigos de researchLines.ts
  photo: string;
  bio: string;
  papers: Paper[];
}

export const researchers: Researcher[] = [
  {
    id: "miguel-flores",
    fullName: "Miguel Alfonso Flores Sánchez",
    degree: "PhD",
    role: "Coordinador",
    affiliation: "EPN — Departamento de Matemática",
    lines: ["LPI-DM-2023-04"],
    photo: "/equipo/miguel-flores.jpg",
    bio: "PhD y coordinador del grupo de investigación META, adscrito al Departamento de Matemática de la Escuela Politécnica Nacional. Su trabajo se enmarca en la línea de Modelización Estocástica Teórica y Aplicada, con énfasis en métodos estadísticos y modelos probabilísticos para datos complejos y de gran volumen. Ha dirigido y codirigido proyectos sobre redes neuronales de grafos aplicadas a la predicción del tráfico urbano (PIS-23-05) y a la estimación del carbono orgánico del suelo (PIS-24-09). Coordina la articulación metodológica del grupo entre la estadística, el aprendizaje automático y las aplicaciones ambientales.",
    papers: [],
  },
  {
    id: "david-donoso",
    fullName: "David Andrés Donoso Vargas",
    degree: "PhD",
    role: "Miembro",
    affiliation: "EPN — Departamento de Biología",
    lines: ["LI-DB-2023-02"],
    photo: "/equipo/david-donoso.jpg",
    bio: "PhD y miembro del grupo META, adscrito al Departamento de Biología de la Escuela Politécnica Nacional. Su línea de trabajo es la Ecología, que aporta el fundamento ambiental del proyecto de estimación del carbono orgánico del suelo (SOC). Dirige el proyecto PIS-24-09, articulando el conocimiento ecológico de los ecosistemas ecuatorianos con los modelos de aprendizaje automático desarrollados por el grupo.",
    papers: [],
  },
  {
    id: "xavier-zapata",
    fullName: "Xavier Eduardo Zapata Ríos",
    degree: "PhD",
    role: "Colaborador",
    affiliation:
      "EPN — Departamento de Ingeniería Civil y Ambiental",
    lines: ["LPI-DICA-2023-01"],
    photo: "/equipo/xavier-zapata.jpg",
    bio: "PhD y colaborador del grupo META, adscrito al Departamento de Ingeniería Civil y Ambiental de la Escuela Politécnica Nacional, en la línea de Geografía y Paisaje. Ha dirigido proyectos sobre gestión integrada de recursos hídricos (Global Open Water Academic Network, VLIR), evapotranspiración del páramo (PIMI-17-04) y la influencia de patrones climáticos globales en los índices espectrales de la vegetación del páramo ecuatoriano (PIJ-17-05). Su experiencia en teledetección, hidrología y análisis del paisaje contribuye al tratamiento de los datos geoespaciales multimodales del proyecto SOC.",
    papers: [],
  },
  {
    id: "mateo-soliz",
    fullName: "Mateo Xavier Soliz Villafuerte",
    degree: "BSc",
    role: "Miembro",
    affiliation: "EPN — Departamento de Matemática",
    lines: ["LPI-DM-2023-04"],
    photo: "/equipo/mateo-soliz.jpg",
    bio: "Profesional del Departamento de Matemática de la Escuela Politécnica Nacional y miembro del grupo META, en la línea de Modelización Estocástica Teórica y Aplicada. Participa en el proyecto PIS-24-09 en el diseño e implementación de los modelos de redes neuronales de grafos para la estimación del carbono orgánico del suelo, y contribuyó a la definición del enfoque metodológico del proyecto de predicción de tráfico urbano (PIS-23-05). Su trabajo se centra en la construcción y evaluación de arquitecturas de aprendizaje automático sobre datos geoespaciales.",
    papers: [],
  },
  {
    id: "cristian-paliz",
    fullName: "Cristian Omar Paliz Acosta",
    degree: "MSc",
    role: "Colaborador",
    affiliation: "ESPAM — Carrera de Ingeniería en Riesgos de Desastres",
    lines: [],
    photo: "/equipo/cristian-paliz.jpg",
    bio: "MSc y colaborador del grupo META, vinculado a la carrera de Ingeniería en Riesgos de Desastres de la ESPAM. Su investigación aborda la variabilidad y la predictibilidad de la precipitación en el Ecuador continental, incluyendo el análisis de entropía y complejidad de los patrones de precipitación (1981–2018) y la influencia evolutiva del fenómeno ENSO. Ha sido investigador principal en estudios de homogeneización de series climáticas y eventos extremos del INAMHI, experiencia que aporta al tratamiento de las variables climáticas del proyecto SOC.",
    papers: [],
  },
  {
    id: "ana-cabezas",
    fullName: "Ana Belén Cabezas Martínez",
    degree: "MSc",
    role: "Miembro",
    affiliation: "EPN — Departamento de Matemática",
    lines: ["LPI-DM-2023-04"],
    photo: "/equipo/ana-cabezas.jpg",
    bio: "MSc y miembro del grupo META, adscrita al Departamento de Matemática de la Escuela Politécnica Nacional, en la línea de Modelización Estocástica Teórica y Aplicada. Su trabajo se orienta a los métodos estadísticos y probabilísticos aplicados al análisis de datos ambientales del grupo, en apoyo a la modelización del carbono orgánico del suelo.",
    papers: [],
  },
  {
    id: "sandra-torres-paguay",
    fullName: "Sandra Janeth Torres Paguay",
    degree: "BSc",
    role: "Colaborador",
    affiliation: "Instituto Nacional de Meteorología e Hidrología (INAMHI)",
    lines: ["LI-DICA-2023-06"],
    photo: "/equipo/sandra-torres-paguay.jpg",
    bio: "Profesional del Instituto Nacional de Meteorología e Hidrología (INAMHI) y colaboradora del grupo META, en la línea de Meteorología y Climatología Aplicada. Ha trabajado como punto focal de clima y datos en el programa ENANDES+ de adaptación y resiliencia climática en los Andes, y participó en estudios de evapotranspiración del páramo ecuatoriano. Su experiencia en el manejo de datos meteorológicos y climáticos sustenta la caracterización de las variables ambientales del proyecto SOC.",
    papers: [],
  },
  {
    id: "jose-palacios",
    fullName: "José Luis Palacios Encalada",
    degree: "PhD",
    role: "Miembro",
    affiliation: "EPN — Departamento de Ingeniería Mecánica",
    lines: [],
    photo: "/equipo/jose-palacios.jpg",
    bio: "PhD y miembro del grupo META, adscrito al Departamento de Ingeniería Mecánica de la Escuela Politécnica Nacional. Su investigación abarca el análisis energético, exergético y de ciclo de vida de procesos industriales —reutilización sostenible de fibra de carbono, reciclaje de baterías de iones de litio y huella hídrica de plantas térmicas—, aportando una perspectiva de sostenibilidad y de modelización numérica al trabajo interdisciplinario del grupo.",
    papers: [],
  },
  {
    id: "carlos-andrade",
    fullName: "Carlos Alberto Andrade Moreno",
    degree: "MSc",
    role: "Colaborador",
    affiliation: "AIMS Consultores — Investigador Académico",
    lines: [],
    photo: "",
    bio: "MSc y colaborador del grupo META, investigador académico en AIMS Consultores. Ha participado en el desarrollo de plataformas de seguimiento y trazabilidad de cacao sostenible y en el diseño de esquemas de medición de sostenibilidad ambiental e inclusión financiera, con herramientas de autoevaluación basadas en algoritmos. Su experiencia conecta la analítica de datos con aplicaciones de sostenibilidad e impacto.",
    papers: [],
  },
  {
    id: "paul-carrillo",
    fullName: "Paul Alexander Carrillo Maldonado",
    degree: "PhD",
    role: "Colaborador",
    affiliation:
      "Universidad de Las Américas (UDLA) — Facultad de Ciencias Económicas y Administrativas",
    lines: [],
    photo: "/equipo/paul-carrillo.jpg",
    bio: "PhD y colaborador del grupo META, adscrito a la Facultad de Ciencias Económicas y Administrativas de la Universidad de Las Américas (UDLA). Aporta al grupo experiencia en métodos cuantitativos y econométricos aplicados al análisis de datos.",
    papers: [],
  },
  {
    id: "priscila-guayasamin",
    fullName: "Priscila Salomé Guayasamín Bahamonde",
    degree: "MSc",
    role: "Colaborador",
    affiliation:
      "Universidad de La Coruña — Doctoranda en Estadística e Investigación Operativa",
    lines: [],
    photo: "",
    bio: "MSc y colaboradora del grupo META, doctoranda en Estadística e Investigación Operativa en la Universidad de La Coruña. Su trabajo se centra en métodos estadísticos avanzados e investigación operativa, en apoyo al análisis cuantitativo de los datos del grupo.",
    papers: [],
  },
  {
    id: "jorge-proano",
    fullName: "Jorge Arturo Proaño Torres",
    degree: "MSc",
    role: "Colaborador",
    affiliation:
      "Universidad de La Coruña — Doctorando en Estadística e Investigación Operativa",
    lines: [],
    photo: "/equipo/jorge-proano.jpg",
    bio: "MSc y colaborador del grupo META, doctorando en Estadística e Investigación Operativa en la Universidad de La Coruña. Contribuye con métodos estadísticos e investigación operativa aplicados al tratamiento de datos complejos del grupo.",
    papers: [],
  },
  {
    id: "jenny-torres",
    fullName: "Jenny Gabriela Torres Olmedo",
    degree: "PhD",
    role: "Colaborador",
    affiliation:
      "EPN — Departamento de Informática y Ciencias de la Computación",
    lines: [],
    photo: "/equipo/jenny-torres.jpg",
    bio: "PhD y colaboradora del grupo META, adscrita al Departamento de Informática y Ciencias de la Computación de la Escuela Politécnica Nacional. Aporta experiencia en computación y ciencias de la información a los desarrollos del grupo, incluyendo la gestión y el procesamiento de los datos del proyecto SOC.",
    papers: [],
  },
];

export const coordinator = researchers[0];
