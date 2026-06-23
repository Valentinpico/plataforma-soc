import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.dark = dark ? "true" : "false";
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}
