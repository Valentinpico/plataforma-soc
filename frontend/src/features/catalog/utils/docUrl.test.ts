import { describe, expect, it } from "vitest";
import { docUrl, isExternal } from "./docUrl";

describe("docUrl", () => {
  it("devuelve la URL externa tal cual", () => {
    expect(docUrl("https://doi.org/10.x")).toBe("https://doi.org/10.x");
  });

  it("mapea ruta local a /files quitando el prefijo data/", () => {
    expect(docUrl("data/documentos/x.pdf")).toContain("/files/documentos/x.pdf");
    expect(docUrl("data/documentos/x.pdf")).not.toContain("data/");
  });

  it("devuelve undefined si no hay ruta", () => {
    expect(docUrl(undefined)).toBeUndefined();
  });
});

describe("isExternal", () => {
  it("true para http(s), false para ruta local", () => {
    expect(isExternal("https://x")).toBe(true);
    expect(isExternal("data/x.pdf")).toBe(false);
    expect(isExternal(undefined)).toBe(false);
  });
});
