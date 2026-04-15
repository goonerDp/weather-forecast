export function getWeatherIconUrl(conditionIcon: string): string {
  const hiRes = conditionIcon.replace("/64x64/", "/128x128/");

  return hiRes.startsWith("//") ? `https:${hiRes}` : hiRes;
}
