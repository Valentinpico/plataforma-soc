import { describe, it, expect } from "vitest";
import { initials } from "./initials";

describe("initials", () => {
  it("nombre de cuatro tokens: primer nombre + primer apellido", () => {
    expect(initials("Miguel Alfonso Flores Sánchez")).toBe("MF");
  });

  it("nombre de dos tokens: ambas iniciales", () => {
    expect(initials("Ana Belén")).toBe("AB");
  });

  it("nombre de tres tokens: primer nombre + tercer token", () => {
    expect(initials("David Andrés Donoso")).toBe("DD");
  });

  it("nombre de un solo token: primera letra en mayúscula", () => {
    expect(initials("Xavier")).toBe("X");
  });

  it("cadena vacía retorna vacío", () => {
    expect(initials("")).toBe("");
  });

  it("nombre con espacios extra", () => {
    expect(initials("  Jenny   Torres  ")).toBe("JT");
  });
});
