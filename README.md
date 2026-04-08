# Mobile Dashboard - Frontend

Dashboard mobile-first de gestion d'utilisateurs avec Next.js.

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Application sur `http://localhost:3000`

## Variables d'environnement

```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Fonctionnalités

- **Auth** : login et inscription publique (VIEWER)
- **Rôles** : ADMIN (accès complet) / VIEWER (lecture seule)
- **CRUD utilisateurs** : création, modification, suppression (ADMIN uniquement)
- **Export CSV** : télécharger la liste des utilisateurs
- **Export PDF** : rapport avec stats du dashboard
- **Notifications temps réel** : via WebSocket (Socket.IO)
- **Push notifications** : alertes même onglet fermé (Service Worker)
- **Offline-first** : fonctionne sans connexion (IndexedDB)
- **Dark/Light mode**
- **Multilingue** (FR/EN)

## Rôles

| Rôle | Voir | Créer/Modifier/Supprimer |
|------|------|--------------------------|
| ADMIN | Oui | Oui |
| VIEWER | Oui | Non |

- Seed backend → ADMIN
- Inscription `/register` → VIEWER

## Pages

| Route | Description |
|-------|-------------|
| /login | Connexion |
| /register | Inscription (VIEWER) |
| /dashboard | Stats, graphiques, export PDF |
| /users | Liste utilisateurs, export CSV |
| /users/create | Créer un utilisateur |
| /users/:id | Détail utilisateur |
| /users/:id/edit | Modifier un utilisateur |

## Technologies

Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, React Query, React Hook Form, Axios, Socket.IO, jsPDF, Dexie.js, next-themes
