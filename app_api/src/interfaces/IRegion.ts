const geoJson:IRegion = {
  name: "Region Name",
  user: "664b8c83b80685570e3b0e42",
  region: {
    type: "Polygon",
    coordinates: [
      [
        [-43.9453125, -22.890625],
        [-43.91015625, -22.864375],
        [-43.88671875, -22.92578125],
        [-43.921875, -22.951171875],
        [-43.9765625, -22.9453125],
        [-43.9453125, -22.890625],
      ],
    ],
  },
};

export interface IRegion {
  name: string;
  user: string;
  region: {
    type: string;
    coordinates: [number,number][][];
  };
}
