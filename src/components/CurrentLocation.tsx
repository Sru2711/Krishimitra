export const getCoords = (
  setterFunction: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
    }>
  >,
  setterErrorFunction: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!("geolocation" in navigator)) {
    setterErrorFunction("Geolocation is not supported.");
    return;
  }

  const watchId = navigator.geolocation.getCurrentPosition(
    (position) => {
      setterFunction({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (err) => setterErrorFunction(err.message),
    {
      enableHighAccuracy: true,
    }
  );
  return watchId

  // return () => navigator.geolocation.clearWatch(watchId);
};