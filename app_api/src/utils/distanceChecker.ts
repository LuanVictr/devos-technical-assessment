import * as turf from "@turf/turf";

export function CheckIfRegionHaveDistance(
  distanceUnit: "meters" | "kilometers",
  distance: number,
  point: [number, number],
  coordinates: [number, number][][]
) {
  const basePoint = turf.point(point);

  const minorDistance = turf.distance(basePoint, getClosestPoint(point, coordinates), {units: distanceUnit});

  return minorDistance <= distance;
}

function getClosestPoint (point: [number, number], coordinates: [number, number][][]) {
  const coordinatesExtracted = coordinates[0];
  const coordinatesLength = coordinatesExtracted.length;
  const pointBase = turf.point(point);
  let closestPoint;
  let minDistance = Infinity;  

  for (let i = 0; i < coordinatesLength ; i += 1 ) {
    const pointTested = turf.point(coordinatesExtracted[i]);
    const distance = turf.distance(pointBase, pointTested);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = pointTested;
    }
  }
  
  return closestPoint;
}