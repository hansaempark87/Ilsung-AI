import { useEffect } from "react";

export function useScrollTop(dep: unknown) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [dep]);
}
