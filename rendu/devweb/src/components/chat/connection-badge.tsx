"use client";

import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConnectionBadgeProps = {
  status: "checking" | "connected" | "disconnected";
  onRefresh?: () => void;
};

const LABELS = {
  checking: "Vérification...",
  connected: "Connecté",
  disconnected: "Déconnecté",
} as const;

export function ConnectionBadge({ status, onRefresh }: ConnectionBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      <Badge
        variant={status === "disconnected" ? "destructive" : "secondary"}
        className={cn(
          status === "connected" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
          status === "checking" && "animate-pulse",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "connected" && "bg-emerald-500",
            status === "disconnected" && "bg-destructive",
            status === "checking" && "bg-muted-foreground",
          )}
        />
        {LABELS[status]}
      </Badge>
      {onRefresh && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRefresh}
          disabled={status === "checking"}
          aria-label="Verifier la connexion"
        >
          <RefreshCw className={cn("size-3.5", status === "checking" && "animate-spin")} />
        </Button>
      )}
    </div>
  );
}
