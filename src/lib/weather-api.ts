const BASE_URL = "https://api.weatherapi.com/v1";

export function getSearchUrl(apiKey: string, query: string): string {
  return `${BASE_URL}/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
}

export function getForecastUrl(
  apiKey: string,
  city: string,
  days: number,
): string {
  return `${BASE_URL}/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=${days}`;
}
