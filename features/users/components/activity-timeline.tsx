"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserPen, UserX } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNotificationsContext } from "@/providers/notifications-provider";
import { useLocale } from "@/providers/locale-provider";
import { timeAgo } from "@/lib/time-ago";

const icons = {
  created: UserPlus,
  updated: UserPen,
  deleted: UserX,
};

const colors = {
  created: "bg-green-500",
  updated: "bg-blue-500",
  deleted: "bg-red-500",
};

export function ActivityTimeline() {
  const { notifications } = useNotificationsContext();
  const { locale, t } = useLocale();
  const [, setTick] = useState(0);

  // Re-render every 30s to update relative times
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const recent = notifications.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t("dashboard.activity")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("dashboard.no_activity")}
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

            <div className="flex flex-col gap-4">
              {recent.map((n) => {
                const Icon = icons[n.type];
                const color = colors[n.type];
                return (
                  <div key={n.id} className="flex items-start gap-3 relative">
                    <div className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full ${color}`}>
                      <Icon className="size-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm leading-snug">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeAgo(n.timestamp, locale)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
