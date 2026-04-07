const UNITS: [string, string, number][] = [
  ["année", "year", 31536000],
  ["mois", "month", 2592000],
  ["semaine", "week", 604800],
  ["jour", "day", 86400],
  ["heure", "hour", 3600],
  ["minute", "minute", 60],
  ["seconde", "second", 1],
];

export function timeAgo(date: Date, locale: "fr" | "en" = "fr"): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 5) return locale === "fr" ? "à l'instant" : "just now";

  for (const [fr, en, secs] of UNITS) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      if (locale === "fr") {
        const plural = count > 1 && fr !== "mois" ? "s" : "";
        return `il y a ${count} ${fr}${plural}`;
      }
      const plural = count > 1 ? "s" : "";
      return `${count} ${en}${plural} ago`;
    }
  }

  return locale === "fr" ? "à l'instant" : "just now";
}
