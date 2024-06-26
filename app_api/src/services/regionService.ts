import { STATUS } from "../enums/status";
import { IRegion } from "../interfaces/IRegion";
import { IRegionUpdate } from "../interfaces/IRegionUpdate";
import { Region, RegionModel, UserModel } from "../models/models";
import { CheckIfRegionHaveDistance } from "../utils/distanceChecker";
import { validateToken } from "../utils/jwt";
import { checkIfPointIsInside } from "../utils/pointChecker";

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

export async function getAllRegionsWithPointService(point: [number, number]) {
  const regionFound = await RegionModel.find();

  const regionsWithPoint = regionFound.filter((region) =>
    checkIfPointIsInside(point, region.region.coordinates)
  );

  return regionsWithPoint;
}

export async function getRegionsWithADistance(
  point: [number, number],
  isFromUser: boolean,
  token: string,
  unit,
  distance:number
) {

  const user = validateToken(token);
  let regions = await RegionModel.find();

  if (isFromUser) {
    regions = await RegionModel.find({user: user});
  }

  const regionsWithDistance = regions.filter((region) => CheckIfRegionHaveDistance(
    unit,
    distance,
    point,
    region.region.coordinates,
  ));

  if (regionsWithDistance.length === 0) {
    throw {
      status: STATUS.NOT_FOUND,
      message: 'No regions found'
    }
  }

  return regionsWithDistance;
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

export async function updateRegion(id: string, regionUpdate: IRegionUpdate) {
  const region = await RegionModel.findOne({ _id: id });

  if (!region) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "Region not found",
    };
  }

  if (Object.keys(regionUpdate).length === 0) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "To update a region you need to provide a body",
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
  regionUpdate.coordinates
    ? (region.region.coordinates = regionUpdate.coordinates)
    : false;

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

export async function deleteRegionService(id: string) {
  const regionFound = await RegionModel.findOne({ _id: id });

  if (!regionFound) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "Region does not exist",
    };
  }

  await regionFound.deleteOne();

  return regionFound;
}
