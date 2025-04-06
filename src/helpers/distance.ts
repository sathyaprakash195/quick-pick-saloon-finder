import haversine from "haversine-distance";

export const getDistanceBetweenPlaces = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  return (
    haversine(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    ) / 1609.344 // Convert meters to miles
  );
};

export const getDistance = ({
  sourceLat,
  sourceLng,
  destinationLat,
  destinationLng,
}: any) => {
  return (
    haversine(
      { latitude: sourceLat, longitude: sourceLng },
      { latitude: destinationLat, longitude: destinationLng }
    ) / 1609.344 // Convert meters to miles
  );
};
