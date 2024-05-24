export function checkIfPointIsInside(point:[number, number], coordinates:[number,number][][]): boolean {
  let intersections = 0;

  const pointX = point[0];
  const pointY = point[1];

  coordinates.forEach(polygon => {
    const polygonPointsNumber = polygon.length;

    for (let i = 0; i < polygonPointsNumber; i++) {
      const startX = polygon[i][0];
      const startY = polygon[i][1];
      const endX = polygon[(i + 1) % polygonPointsNumber][0];
      const endY = polygon[(i + 1) % polygonPointsNumber][1];

      if ((startY <= pointY && pointY < endY) || (endY <= pointY && pointY < startY)) {
        const intersectX = (endX - startX) * (pointY - startY) / (endY - startY) + startX;

        if (pointX < intersectX) {
          intersections++;
        }
      }
    }
  });

  return intersections % 2 !== 0;
}