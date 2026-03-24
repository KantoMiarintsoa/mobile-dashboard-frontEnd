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
- **Dexie.js** - Base de données IndexedDB pour le support offline
- **Lucide React** - Icones

## Fonctionnalites

- Authentification (login / register) avec JWT stocke dans les cookies
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
  api.ts                   # Instance Axios avec intercepteur JWT
  auth.service.ts          # Appels API authentification
  user.service.ts          # Appels API utilisateurs
components/ui/             # Composants shadcn/ui
providers/                 # QueryProvider (React Query)
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
| POST | `/api/users/register` | Inscription | Non |
| GET | `/api/users/me` | Profil connecte | Oui |
| GET | `/api/users/list` | Liste des utilisateurs | Oui |
| GET | `/api/users/:id/details` | Detail d'un utilisateur | Oui |
| PUT | `/api/users/:id/update` | Modifier un utilisateur | Oui |
| DELETE | `/api/users/:id/delete` | Supprimer un utilisateur | Oui |

## Variables d'environnement

| Variable | Description | Valeur par defaut |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de base de l'API backend | `http://localhost:3002/api` |
