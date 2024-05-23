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

  const createdRegion = await RegionModel.create(newRegion);

  return { message: "Region created successfully", newRegion: createdRegion };
}

export async function getAllRegionsWithPoint(lat:string, lng:string) {

  const regionFound = await RegionModel.find()
  
}

export async function getRegionByIdService(id:string) {
  const regionFound = await RegionModel.findOne({_id: id});

  if (!regionFound) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "Region not found",
    };
  }

  return regionFound;
}
