import { Card } from "@heroui/react";
import type { WeatherData } from "@/types";

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const iconUrl = data.conditionIcon.startsWith("//")
    ? `https:${data.conditionIcon}`
    : data.conditionIcon;

  return (
    <Card>
      <Card.Header className="flex-row items-center gap-4">
        <img src={iconUrl} alt={data.condition} width={64} height={64} />
        <div>
          <Card.Title className="text-2xl">{data.city}</Card.Title>
          <Card.Description>
            {data.region}, {data.country}
          </Card.Description>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">
            {Math.round(data.tempC)}&deg;
          </span>
          <span className="text-lg text-foreground/60">{data.condition}</span>
        </div>
      </Card.Content>
    </Card>
  );
}
