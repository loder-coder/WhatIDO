import { validateCoordinates, type Coordinates } from "../../utils/geo.js";

export interface KmaGrid {
  readonly nx: number;
  readonly ny: number;
}

export function convertWgs84ToKmaGrid(coordinates: Coordinates): KmaGrid {
  validateCoordinates(coordinates);
  const re = 6371.00877;
  const grid = 5.0;
  const slat1 = 30.0;
  const slat2 = 60.0;
  const olon = 126.0;
  const olat = 38.0;
  const xo = 43;
  const yo = 136;
  const degrad = Math.PI / 180.0;
  const reGrid = re / grid;
  const slat1Rad = slat1 * degrad;
  const slat2Rad = slat2 * degrad;
  const olonRad = olon * degrad;
  const olatRad = olat * degrad;
  let sn = Math.tan(Math.PI * 0.25 + slat2Rad * 0.5) / Math.tan(Math.PI * 0.25 + slat1Rad * 0.5);
  sn = Math.log(Math.cos(slat1Rad) / Math.cos(slat2Rad)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1Rad * 0.5);
  sf = (sf ** sn * Math.cos(slat1Rad)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olatRad * 0.5);
  ro = (reGrid * sf) / ro ** sn;
  let ra = Math.tan(Math.PI * 0.25 + coordinates.latitude * degrad * 0.5);
  ra = (reGrid * sf) / ra ** sn;
  let theta = coordinates.longitude * degrad - olonRad;
  if (theta > Math.PI) {
    theta -= 2.0 * Math.PI;
  }
  if (theta < -Math.PI) {
    theta += 2.0 * Math.PI;
  }
  theta *= sn;
  return {
    nx: Math.floor(ra * Math.sin(theta) + xo + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + yo + 0.5)
  };
}
