"use client";

import { Switch } from "@/components/ui/switch";
import { IconBell, IconBellRinging } from "@tabler/icons-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { cn } from "@/lib/utils";

export function PushNotificationSwitch({ className }: { className?: string }) {
  const { pushEnabled, pushLoading, toggle, getSubtitle, isUnsupported } =
    usePushNotifications();

  const subtitle = getSubtitle();

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border last:border-b-0",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center justify-center p-2 rounded-lg shrink-0 bg-surface-hover text-text-primary">
          {pushEnabled ? (
            <IconBellRinging className="size-4.5" />
          ) : (
            <IconBell className="size-4.5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-primary font-medium">
            Notifikasi push
          </p>
          {subtitle && (
            <p className="text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">
        <Switch
          checked={pushEnabled}
          disabled={pushLoading || isUnsupported}
          onCheckedChange={toggle}
          className="data-checked:bg-text-primary data-checked:border-text-primary"
        />
      </div>
    </div>
  );
}
