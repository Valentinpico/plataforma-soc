export interface Member {
  name: string;
  role: string;
  org: string;
}

// Equipo del Proyecto PIS-24-09 (fuente: registro del grupo de investigación META).
export const team: Member[] = [
  {
    name: "PhD. David Andrés Donoso Vargas",
    role: "Director del proyecto",
    org: "Departamento de Biología — EPN",
  },
  {
    name: "PhD. Miguel Flores",
    role: "Codirector · Coordinador grupo META",
    org: "Escuela Politécnica Nacional",
  },
  {
    name: "Mateo Xavier Soliz Villafuerte",
    role: "Investigador — modelos GNN y datos",
    org: "Escuela Politécnica Nacional",
  },
  {
    name: "Ing. Valentin Pico",
    role: "Ingeniero de software — desarrollo de la plataforma",
    org: "Escuela Politécnica Nacional",
  },
];
