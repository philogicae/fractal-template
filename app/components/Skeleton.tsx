import { cn } from "@utils/tw"

/**
 * Skeleton placeholder - a themed pulsing block used while content loads.
 *
 * @example
 * <Skeleton className="h-6 w-40" />
 * <Skeleton className="h-8 w-full rounded-lg" />
 */
export function Skeleton({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "bg-(--color-bg-surface) rounded-lg animate-pulse",
        className
      )}
      {...rest}
    />
  )
}
