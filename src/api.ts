export const openWeatherApi = (lat: number, lon: number) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain&hourly=precipitation_probability&timezone=auto`;


export const getSoilDataApi = (lat: number, lon: number) =>
  `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}` +
  `&property=clay` +
  `&property=sand` +
  `&property=silt` +
  `&property=phh2o` +
  `&property=soc` +
  `&property=cec` +
  `&property=nitrogen` +
  `&property=cfvo` +
  `&depth=0-5cm` +
  `&depth=5-15cm` +
  `&depth=15-30cm` +
  `&depth=30-60cm` +
  `&value=Q0.5`;