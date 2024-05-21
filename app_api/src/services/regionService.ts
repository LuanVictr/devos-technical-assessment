import { STATUS } from "../enums/status";
import { IRegion } from "../interfaces/IRegion";
import { RegionModel } from "../models/models";

export async function createNewRegion(newRegion: IRegion) {
  if (!newRegion.name || !newRegion.region.coordinates) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "Region info is missing on request body",
    };
  }

  console.log(newRegion)
  const createdRegion = await RegionModel.create(newRegion);

  return { message: "Region created successfully", newRegion: createdRegion };
}
