"use client";

import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CONFIG, type ChatConfig } from "@/lib/chat-config";

type SettingsDialogProps = {
  config: ChatConfig;
  onSave: (config: ChatConfig) => void;
  onReset: () => void;
};

export function SettingsDialog({ config, onSave, onReset }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ChatConfig>(config);

  useEffect(() => {
    if (open) setDraft(config);
  }, [open, config]);

  function updateDraft<K extends keyof ChatConfig>(key: K, value: ChatConfig[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(draft);
    setOpen(false);
  }

  function handleReset() {
    setDraft(DEFAULT_CONFIG);
    onReset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" aria-label="Reglages">
            <Settings2 className="size-4" />
            Reglages
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reglages du chat</DialogTitle>
          <DialogDescription>
            URL du serveur, modele et parametres d&apos;inference. Sauvegarde locale dans le
            navigateur.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="baseURL">URL du serveur (OpenAI-compatible)</Label>
            <Input
              id="baseURL"
              value={draft.baseURL}
              onChange={(e) => updateDraft("baseURL", e.target.value)}
              placeholder="http://localhost:11434/v1"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="model">Nom du modele</Label>
            <Input
              id="model"
              value={draft.model}
              onChange={(e) => updateDraft("model", e.target.value)}
              placeholder="phi3.5"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="systemPrompt">System prompt</Label>
            <Textarea
              id="systemPrompt"
              value={draft.systemPrompt}
              onChange={(e) => updateDraft("systemPrompt", e.target.value)}
              rows={5}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-xs text-muted-foreground">{draft.temperature.toFixed(1)}</span>
            </div>
            <input
              id="temperature"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={draft.temperature}
              onChange={(e) => updateDraft("temperature", Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maxOutputTokens">Tokens max par reponse</Label>
            <Input
              id="maxOutputTokens"
              type="number"
              min={128}
              max={8192}
              step={64}
              value={draft.maxOutputTokens}
              onChange={(e) => updateDraft("maxOutputTokens", Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reinitialiser
          </Button>
          <Button type="button" onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
