import { Card, Skeleton } from "@heroui/react";

export function WeatherCardSkeleton() {
  return (
    <Card aria-busy="true" aria-label="Loading weather">
      <Card.Header className="flex-row items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-14 w-40" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </Card.Content>
    </Card>
  );
}
