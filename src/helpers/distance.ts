import { getDistance } from "ol/sphere";

export const getDistanceBetweenPlaces = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  return getDistance([lon1, lat1], [lon2, lat2]);
};
