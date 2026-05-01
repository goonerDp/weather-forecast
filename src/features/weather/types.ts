export interface WeatherData {
  city: string;
  region: string;
  country: string;
  tempC: number;
  condition: string;
  conditionIcon: string;
  minTempC: number;
  maxTempC: number;
  windKph: number;
  windDir: string;
  feelsLikeC: number;
  humidity: number;
  sunrise: string;
  sunset: string;
  forecastDate: string;
  lastUpdatedEpochMs: number;
}
