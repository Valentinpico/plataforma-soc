import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEntityActions } from "./useEntityActions";

function fakeApi() {
  return {
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe("useEntityActions", () => {
  it("create retorna true y llama onChanged en éxito", async () => {
    const api = fakeApi();
    api.create.mockResolvedValue({ id: 1 });
    const onChanged = vi.fn();
    const { result } = renderHook(() => useEntityActions(api, onChanged));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.create({ name: "x" });
    });

    expect(ok).toBe(true);
    expect(api.create).toHaveBeenCalledWith({ name: "x" });
    expect(onChanged).toHaveBeenCalledOnce();
  });

  it("retorna false y guarda el error sin lanzar", async () => {
    const api = fakeApi();
    api.update.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useEntityActions(api, vi.fn()));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.update(1, { name: "x" });
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe("boom");
  });

  it("remove delega en api.remove", async () => {
    const api = fakeApi();
    api.remove.mockResolvedValue(null);
    const { result } = renderHook(() => useEntityActions(api, vi.fn()));

    await act(async () => {
      await result.current.remove(7);
    });

    expect(api.remove).toHaveBeenCalledWith(7);
  });
});
