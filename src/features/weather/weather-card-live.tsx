"use client";

import useSWR from "swr";
import { WeatherCard } from "./weather-card";
import type { WeatherData } from "./types";

const STALE_MS = 5 * 60 * 1000; // 5 minutes

async function fetchForecastFromApi([, city]: [
  string,
  string,
]): Promise<WeatherData> {
  const res = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch forecast");
  }
  return res.json();
}

interface WeatherCardLiveProps {
  city: string;
  initialData: WeatherData;
}

export function WeatherCardLive({ city, initialData }: WeatherCardLiveProps) {
  const { data } = useSWR(["forecast", city], fetchForecastFromApi, {
    fallbackData: initialData,
    revalidateOnMount: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    focusThrottleInterval: STALE_MS,
  });

  return <WeatherCard data={data ?? initialData} />;
}
