// Extrae iniciales de un nombre completo.
// Regla: primer letra del primer nombre + primera letra del primer apellido.
// Los apellidos comienzan después del segundo token (para nombres como "Miguel Alfonso Flores Sánchez").
// Para un nombre de un solo token retorna la primera letra.
export function initials(fullName: string): string {
  if (!fullName.trim()) return "";
  const words = fullName.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  // Asume patrón: [Nombre1] [Nombre2?] [Apellido1] [Apellido2?]
  // Toma primera inicial del primer nombre y del tercer token si existe (primer apellido),
  // de lo contrario el segundo token.
  const first = words[0][0].toUpperCase();
  const lastStart = words.length >= 3 ? words[2][0].toUpperCase() : words[1][0].toUpperCase();
  return first + lastStart;
}
