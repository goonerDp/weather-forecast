import { Card } from "@heroui/react";
import type { WeatherData } from "./types";
import Image from "next/image";
import { Stat } from "./stat";
import { getWeatherIconUrl } from "./icon-url";
import { formatForecastDate } from "@/lib/format-forecast-date";

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const iconUrl = getWeatherIconUrl(data.conditionIcon);

  return (
    <Card>
      <Card.Header className="flex-row items-center gap-4">
        <Image src={iconUrl} alt={data.condition} width={64} height={64} />
        <div className="min-w-0 flex-1">
          <Card.Title className="text-2xl truncate">{data.city}</Card.Title>
          <Card.Description className="truncate">
            {data.region ? `${data.region}, ` : ""}
            {data.country}
          </Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-6">
        <div>
          <div className="text-sm text-foreground/60">
            {formatForecastDate(data.forecastDate)}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-6xl font-bold leading-none tracking-tight">
              {Math.round(data.tempC)}&deg;
            </span>
            <span className="text-lg text-foreground/70">{data.condition}</span>
          </div>
          <div className="mt-2 text-sm text-foreground/60">
            H: {Math.round(data.maxTempC)}&deg; &middot; L:{" "}
            {Math.round(data.minTempC)}&deg; &middot; Feels like{" "}
            {Math.round(data.feelsLikeC)}&deg;
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <Stat label="Wind">
            {Math.round(data.windKph)} kph {data.windDir}
          </Stat>
          <Stat label="Humidity">{data.humidity}%</Stat>
          <Stat label="Sunrise">{data.sunrise}</Stat>
          <Stat label="Sunset">{data.sunset}</Stat>
        </dl>
      </Card.Content>
      <Card.Footer className="text-xs text-foreground/50">
        Updated {data.lastUpdated} &middot; {data.timezone}
      </Card.Footer>
    </Card>
  );
}
