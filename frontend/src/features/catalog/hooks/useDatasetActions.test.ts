import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../api/catalogApi", () => ({
  catalogApi: {
    createDataset: vi.fn(),
    updateDataset: vi.fn(),
    deleteDataset: vi.fn(),
  },
}));

import { catalogApi } from "../api/catalogApi";
import { useDatasetActions } from "./useDatasetActions";

const create = catalogApi.createDataset as ReturnType<typeof vi.fn>;

describe("useDatasetActions", () => {
  it("retorna true y llama onChanged cuando la acción funciona", async () => {
    create.mockResolvedValue({ id: 1 });
    const onChanged = vi.fn();
    const { result } = renderHook(() => useDatasetActions(onChanged));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.create({ name: "x" });
    });

    expect(ok).toBe(true);
    expect(onChanged).toHaveBeenCalledOnce();
  });

  it("retorna false y guarda el error sin lanzar", async () => {
    create.mockRejectedValue(new Error("boom"));
    const onChanged = vi.fn();
    const { result } = renderHook(() => useDatasetActions(onChanged));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.create({ name: "x" });
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe("boom");
  });
});
