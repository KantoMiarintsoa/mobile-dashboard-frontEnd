export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    // Sidebar & nav
    "nav.dashboard": "Tableau de bord",
    "nav.users": "Utilisateurs",
    "nav.logout": "Déconnexion",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.empty": "Aucune notification",
    "notifications.clear": "Vider",
    "notifications.user_created": "Utilisateur \"{name}\" ajouté",
    "notifications.user_updated": "Utilisateur \"{name}\" modifié",
    "notifications.user_deleted": "Un utilisateur a été supprimé",

    // Users
    "users.title": "Utilisateurs",
    "users.create": "Ajouter un utilisateur",
    "users.new": "Nouvel utilisateur",
    "users.back": "Retour",
    "users.name": "Nom",
    "users.email": "Email",
    "users.password": "Mot de passe",
    "users.create_btn": "Créer",
    "users.creating": "Création...",
    "users.create_error": "Erreur lors de la création",
    "users.edit": "Modifier",
    "users.delete": "Supprimer",
    "users.actions": "Actions",
    "users.created_at": "Créé le",

    // Login
    "login.title": "Bienvenue",
    "login.subtitle": "Connectez-vous à votre compte",
    "login.email": "Email",
    "login.password": "Mot de passe",
    "login.submit": "Se connecter",
    "login.loading": "Connexion...",
    "login.error": "Email ou mot de passe incorrect",

    // Dashboard
    "dashboard.title": "Tableau de bord",
    "dashboard.total_users": "Total utilisateurs",
    "dashboard.recent_users": "Utilisateurs récents",
    "dashboard.activity": "Activité récente",
    "dashboard.no_activity": "Aucune activité récente",
    "dashboard.chart_title": "Activité des 7 derniers jours",
    "dashboard.chart_created": "Créés",
    "dashboard.chart_updated": "Modifiés",
    "dashboard.chart_deleted": "Supprimés",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.users": "Users",
    "nav.logout": "Logout",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.empty": "No notifications",
    "notifications.clear": "Clear",
    "notifications.user_created": "User \"{name}\" created",
    "notifications.user_updated": "User \"{name}\" updated",
    "notifications.user_deleted": "A user has been deleted",

    // Users
    "users.title": "Users",
    "users.create": "Add user",
    "users.new": "New user",
    "users.back": "Back",
    "users.name": "Name",
    "users.email": "Email",
    "users.password": "Password",
    "users.create_btn": "Create",
    "users.creating": "Creating...",
    "users.create_error": "Error creating user",
    "users.edit": "Edit",
    "users.delete": "Delete",
    "users.actions": "Actions",
    "users.created_at": "Created at",

    // Login
    "login.title": "Welcome",
    "login.subtitle": "Sign in to your account",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Sign in",
    "login.loading": "Signing in...",
    "login.error": "Invalid email or password",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.total_users": "Total users",
    "dashboard.recent_users": "Recent users",
    "dashboard.activity": "Recent activity",
    "dashboard.no_activity": "No recent activity",
    "dashboard.chart_title": "Activity (last 7 days)",
    "dashboard.chart_created": "Created",
    "dashboard.chart_updated": "Updated",
    "dashboard.chart_deleted": "Deleted",
  },
};

export function t(key: string, locale: Locale, params?: Record<string, string>): string {
  let text = translations[locale]?.[key] || translations.fr[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}
