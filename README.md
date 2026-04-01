# Mobile Dashboard Front

Dashboard de gestion d'utilisateurs avec une interface mobile-first, construit avec Next.js et connecté a un backend NestJS.

## Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Styles utilitaires
- **shadcn/ui** - Composants UI (Card, Dialog, Table, AlertDialog, Skeleton, Sonner)
- **React Query** - Gestion du cache et des requetes API
- **React Hook Form** - Gestion des formulaires
- **Class Validator** - Validation des donnees avec decorateurs TypeScript
- **Axios** - Client HTTP avec intercepteur JWT
- **js-cookie** - Stockage du token JWT dans les cookies
- **Dexie.js** - Base de donnees IndexedDB pour le support offline
- **Socket.IO Client** - WebSocket pour les notifications en temps reel
- **next-themes** - Mode dark/light
- **Lucide React** - Icones

## Fonctionnalites

- Authentification (login) avec JWT stocke dans les cookies
- CRUD utilisateurs complet (creation, lecture, modification, suppression)
- Interface mobile-first responsive (cartes sur mobile, table sur desktop)
- Sidebar avec navigation (cachee sur mobile, menu hamburger)
- Modals shadcn pour creation et modification d'utilisateurs
- Confirmation de suppression avec AlertDialog
- Notifications toast (succes / erreur) avec Sonner
- Skeleton loading sur toutes les pages
- Bouton rafraichir avec animation et skeleton
- Validation des formulaires avec class-validator
- Theme violet clair et blanc
- **Support offline-first** (fonctionne sans connexion internet)
- **Notifications en temps reel** via WebSocket (Socket.IO)
- **Mode dark/light** avec next-themes
- **Multilingue** (FR/EN)

## Support Offline-First

L'application fonctionne même sans connexion internet grâce à une approche **offline-first** :

### Comment ça marche ?

1. **Base de données locale (IndexedDB via Dexie.js)**
   - Les données des utilisateurs sont stockées localement dans le navigateur (`lib/db.ts`)
   - Deux tables : `users` pour les utilisateurs et `syncQueue` pour les actions en attente

2. **Lecture des données**
   - **En ligne** : l'app récupère les données depuis l'API et met à jour le cache local
   - **Hors ligne** : l'app lit directement depuis la base locale (IndexedDB)

3. **Écriture des données (create / update / delete)**
   - **En ligne** : l'action est envoyée à l'API normalement
   - **Hors ligne** : l'action est sauvegardée dans une **file d'attente de synchronisation** (`syncQueue`) et appliquée localement pour que l'utilisateur voie le changement immédiatement

4. **Synchronisation au retour en ligne**
   - La fonction `replayQueue()` (`lib/sync.ts`) rejoue toutes les actions en attente vers l'API dans l'ordre chronologique
   - Les actions réussies sont supprimées de la file d'attente

### Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `lib/db.ts` | Définition de la base IndexedDB (tables `users` et `syncQueue`) |
| `lib/sync.ts` | Logique de synchronisation : `replayQueue()` et `isOnline()` |
| `service/user.service.ts` | Service utilisateur avec fallback offline pour chaque opération CRUD |

## WebSocket - Notifications en temps reel

Le frontend se connecte au backend via **Socket.IO** pour recevoir les notifications en temps reel quand un utilisateur est cree, modifie ou supprime.

### Installation

```bash
pnpm add socket.io-client
```

### Comment ca marche

1. Au login, le `SocketProvider` se connecte au serveur WebSocket (`http://localhost:3002`)
2. Le hook `useUsersRealtime` ecoute les evenements `user:created`, `user:updated`, `user:deleted`
3. A chaque evenement : le cache React Query est invalide + un toast apparait + la notification est ajoutee a la liste
4. Les notifications existantes sont chargees depuis l'API `GET /api/notifications` au montage

### Ou voir les notifications

- **Icone cloche** (en haut a droite) : badge rouge avec le nombre de non-lues, clic pour ouvrir le dropdown
- **Sidebar** (desktop) et **menu mobile** : liste des 5 dernieres notifications

### Fichiers concernes

| Fichier | Role |
|---|---|
| `lib/socket.ts` | Singleton Socket.IO client avec auth JWT |
| `providers/socket-provider.tsx` | Context React pour la connexion WebSocket |
| `providers/notifications-provider.tsx` | Context pour partager les notifications |
| `hooks/use-notifications.ts` | Hook : charge depuis l'API + gere l'etat local |
| `features/users/hooks/use-users-realtime.ts` | Ecoute les evenements WebSocket et ajoute les notifications |
| `features/users/hooks/use-online-sync.ts` | Combine sync offline + ecoute temps reel |
| `service/notification.service.ts` | Appels API : GET /notifications, PATCH /notifications/read |

### Evenements ecoutes

| Evenement | Action dans le frontend |
|---|---|
| `user:created` | Invalide le cache users + toast succes + notification ajoutee |
| `user:updated` | Invalide le cache users + toast info + notification ajoutee |
| `user:deleted` | Invalide le cache users + toast warning + notification ajoutee |

### Tester

1. Lancer le backend (`pnpm run start:dev` dans `mobile-dashboard-back`)
2. Lancer le frontend (`pnpm dev` dans `mobile-dashboard-front`)
3. Se connecter avec `admin@gmail.com` / `admin123`
4. Ouvrir **2 onglets** du navigateur sur le dashboard
5. Dans l'onglet 1 : creer un utilisateur
6. Dans l'onglet 2 : la notification apparait automatiquement (toast + badge + sidebar)
7. Dans F12 → Console : `[WS] Connected: xxx` confirme que le socket est connecte

## Architecture

Le projet suit une **architecture par feature** (feature-based architecture). Chaque fonctionnalite (auth, users) est isolee dans son propre dossier sous `features/` avec ses composants, hooks, schemas et types. Cela permet une meilleure separation des responsabilites, une maintenance simplifiee et une scalabilite du projet.

```
app/
  (unauthorized)/          # Routes publiques (login, register)
  (protected)/             # Routes protegees (dashboard, users)
features/
  auth/
    components/            # LoginForm, RegisterForm
    hooks/                 # useLogin, useRegister
    schemas/               # Class-validator schemas
    types/                 # LoginRequest, AuthResponse
  users/
    components/            # UsersTable, UserDetail, UserFormModal, DashboardStats
    hooks/                 # useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser
    schemas/               # CreateUserFormData, UpdateUserFormData
service/
  api.ts                   # Instance Axios avec intercepteur JWT (+ redirect 401)
  auth.service.ts          # Appels API authentification
  user.service.ts          # Appels API utilisateurs (avec fallback offline)
  notification.service.ts  # Appels API notifications
lib/
  db.ts                    # Base IndexedDB (Dexie.js)
  sync.ts                  # Synchronisation offline (replayQueue)
  socket.ts                # Singleton Socket.IO client
  i18n.ts                  # Traductions FR/EN
hooks/
  use-notifications.ts     # Hook notifications (API + local)
components/
  ui/                      # Composants shadcn/ui
  theme-toggle.tsx         # Bouton dark/light
  locale-toggle.tsx        # Bouton FR/EN
providers/
  query-provider.tsx       # React Query
  theme-provider.tsx       # next-themes
  locale-provider.tsx      # Multilingue
  socket-provider.tsx      # Connexion WebSocket
  notifications-provider.tsx # Context notifications
types/                     # Types partages (User, CreateUserDto, UpdateUserDto)
```

## Pre-requis

- Node.js >= 18
- pnpm
- Backend NestJS en cours d'execution

## Installation

1. Cloner le projet

```bash
git clone <url-du-repo>
cd mobile-dashboard-front
```

2. Installer les dependances

```bash
pnpm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Modifier `.env.local` si necessaire :

```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

4. Lancer le serveur de developpement

```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|---|---|
| `pnpm dev` | Lancer le serveur de developpement |
| `pnpm build` | Construire l'application pour la production |
| `pnpm start` | Lancer l'application en mode production |
| `pnpm lint` | Lancer le linter ESLint |

## Endpoints API backend

L'application consomme les endpoints suivants du backend NestJS :

| Methode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Connexion | Non |
| POST | `/api/users/create` | Creer un utilisateur | Oui |
| GET | `/api/notifications` | Liste des notifications | Oui |
| PATCH | `/api/notifications/read` | Marquer comme lues | Oui |
| GET | `/api/users/me` | Profil connecte | Oui |
| GET | `/api/users/list` | Liste des utilisateurs | Oui |
| GET | `/api/users/:id/details` | Detail d'un utilisateur | Oui |
| PUT | `/api/users/:id/update` | Modifier un utilisateur | Oui |
| DELETE | `/api/users/:id/delete` | Supprimer un utilisateur | Oui |

## Variables d'environnement

| Variable | Description | Valeur par defaut |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de base de l'API backend | `http://localhost:3002/api` |
