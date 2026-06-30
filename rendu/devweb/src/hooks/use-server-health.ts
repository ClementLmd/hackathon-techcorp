"use client";

import { useCallback, useEffect, useState } from "react";
import type { HealthResult } from "@/lib/ollama-health";

const POLL_INTERVAL_MS = 15_000;

type HealthState = {
  status: "checking" | "connected" | "disconnected";
  result: HealthResult | null;
};

export function useServerHealth(baseURL: string, model: string, enabled = true) {
  const [state, setState] = useState<HealthState>({
    status: "checking",
    result: null,
  });

  const check = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "checking" }));

    try {
      const params = new URLSearchParams({ baseURL, model });
      const res = await fetch(`/api/health?${params}`, { cache: "no-store" });
      const result = (await res.json()) as HealthResult;

      setState({
        status: result.connected ? "connected" : "disconnected",
        result,
      });
    } catch {
      setState({
        status: "disconnected",
        result: {
          connected: false,
          baseURL,
          model,
          error: "Impossible de verifier l'etat du serveur",
        },
      });
    }
  }, [baseURL, model]);

  useEffect(() => {
    if (!enabled) return;

    void check();
    const id = setInterval(() => void check(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [check, enabled]);

  return { ...state, refresh: check };
}
