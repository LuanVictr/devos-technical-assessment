import { STATUS } from "../enums/status";
import { IRegion } from "../interfaces/IRegion";
import { RegionModel } from "../models/models";

export async function createNewRegion(newRegion: IRegion) {
  if (!newRegion) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "Region info is missing on request body",
    };
  }
  const createdRegion = await RegionModel.create(newRegion);

  return { message: "Region created successfully", user: createdRegion };
}
