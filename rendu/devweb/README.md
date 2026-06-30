# TechCorp — Interface chat DEV WEB

Interface web de chat professionnelle en temps réel, branchée sur un serveur d'inférence Ollama (API OpenAI-compatible). Livrable équipe DEV WEB du hackathon TechCorp.

## Prérequis

- **Node.js** 22+
- **pnpm** 9+
- **Ollama** en local (ou serveur fourni par l'équipe INFRA)

## Lancement (une commande)

Depuis ce dossier (`rendu/devweb/`) :

```bash
pnpm go
```

Installe les dépendances si besoin et démarre le serveur de développement sur [http://localhost:3000](http://localhost:3000).

Alternative si les dépendances sont déjà installées :

```bash
pnpm dev
```

## Configuration serveur d'inférence

### Variables d'environnement (côté Next.js)

Copiez `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

| Variable | Défaut | Description |
|----------|--------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434/v1` | URL OpenAI-compatible du serveur Ollama |
| `OLLAMA_MODEL` | `phi3.5` | Nom du modèle par défaut |

Ces valeurs servent de fallback si le front n'envoie pas de configuration.

### Réglages dans l'interface

Le panneau **Réglages** permet de modifier (sans redémarrer l'app) :

- URL du serveur
- Nom du modèle
- System prompt (orienté finance/business)
- Température et tokens max

Les préférences sont **persistées dans le localStorage** du navigateur.

### Ollama local (développement)

```bash
ollama run phi3.5
```

Puis ouvrez l'interface : le badge doit afficher **Connecté**. Si le modèle n'est pas chargé, une bannière orange indique la commande à exécuter.

### Intégration équipe INFRA

Quand le serveur INFRA est prêt :

1. Récupérer l'URL + port (ex. `http://<ip-infra>:11434/v1`)
2. Récupérer le **nom exact du modèle** (ex. modèle custom créé via `ollama create`)
3. Mettre à jour les réglages dans l'UI ou `.env.local`

## Architecture

```
Navigateur → POST /api/chat (Next.js) → Ollama /v1 (streamText)
                ↓
         GET /api/health (sonde connexion)
```

Le navigateur ne contacte jamais Ollama directement (évite CORS, permet d'injecter le system prompt côté serveur).

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm go` | Install + dev (lancement unique) |
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build production |
| `pnpm start` | Serveur production (après `build`) |
| `pnpm lint` | ESLint |

## Build production

```bash
pnpm install
pnpm build
pnpm start
```

## API interne

- `POST /api/chat` — streaming de réponses (Vercel AI SDK). Voir `API_CONTRACT.md`.
- `GET /api/health?baseURL=...&model=...` — état de connexion au serveur d'inférence.

## Stack

- Next.js 16 (App Router) + TypeScript
- Vercel AI SDK (`ai`, `@ai-sdk/react`) + provider OpenAI-compatible → Ollama
- Tailwind CSS 4 + shadcn/ui

## Fonctionnalités

- Chat streamé token par token avec historique
- Rendu markdown des réponses
- Badge connecté / déconnecté (health check toutes les 15 s)
- Gestion d'erreurs et bannières d'alerte
- Nouvelle conversation, stop génération, suggestions
