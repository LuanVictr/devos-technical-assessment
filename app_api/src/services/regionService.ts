import { STATUS } from "../enums/status";
import { IRegion } from "../interfaces/IRegion";
import { RegionModel, UserModel } from "../models/models";

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

export async function getAllRegionsWithPoint(lat: string, lng: string) {
  const regionFound = await RegionModel.find();
}

export async function getRegionByIdService(id: string) {
  const regionFound = await RegionModel.findOne({ _id: id });

  if (!regionFound) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "Region not found",
    };
  }

  return regionFound;
}

export async function updateRegion(id: string, regionUpdate: IRegion) {
  const region = await RegionModel.findOne({ _id: id });

  if (!region) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "Region not found",
    };
  }

  if (!regionUpdate.user) {
    throw {
      status: STATUS.INTERNAL_SERVER_ERROR,
      message:
        "This region does not have a user. This region should not exist.",
    };
  }

  regionUpdate.name ? (region.name = regionUpdate.name) : false;
  if (regionUpdate.region) {
    regionUpdate.region.coordinates
      ? (region.region.coordinates = regionUpdate.region.coordinates)
      : false;
  }

  if (regionUpdate.user) {
    await UserModel.findOneAndUpdate(
      { _id: region.user },
      { $pull: { regions: region._id } },
      { new: true }
    );
    await UserModel.findOneAndUpdate(
      { _id: regionUpdate.user },
      { $push: { regions: region._id } },
      { new: true }
    );

    region.user = regionUpdate.user;
  }

  await region.save();

  return region;
}
