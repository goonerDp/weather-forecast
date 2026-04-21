import { formatCity } from "@/lib/format-city";
import type { CitySearchResult } from "./types";

export function RemovedToast({ city }: { city: CitySearchResult }) {
  return (
    <div>
      Removed <span className="italic text-muted">{formatCity(city)}</span> from
      recent search
    </div>
  );
}
