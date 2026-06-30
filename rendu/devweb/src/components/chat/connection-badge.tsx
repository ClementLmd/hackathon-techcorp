"use client";

import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConnectionBadgeProps = {
  status: "checking" | "connected" | "disconnected";
  onRefresh?: () => void;
  inverted?: boolean;
};

const LABELS = {
  checking: "Vérification...",
  connected: "Connecté",
  disconnected: "Déconnecté",
} as const;

export function ConnectionBadge({ status, onRefresh, inverted }: ConnectionBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      <Badge
        variant={status === "disconnected" ? "destructive" : "secondary"}
        className={cn(
          inverted && status !== "disconnected" && "border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground",
          !inverted && status === "connected" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
          status === "checking" && "animate-pulse",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "connected" && (inverted ? "bg-emerald-300" : "bg-emerald-500"),
            status === "disconnected" && "bg-destructive",
            status === "checking" && (inverted ? "bg-primary-foreground/60" : "bg-muted-foreground"),
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
          aria-label="Vérifier la connexion"
          className={cn(inverted && "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground")}
        >
          <RefreshCw className={cn("size-3.5", status === "checking" && "animate-spin")} />
        </Button>
      )}
    </div>
  );
}
