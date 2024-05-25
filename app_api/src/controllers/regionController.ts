import { Request, Response } from "express";
import { STATUS } from "../enums/status";
import {
  createNewRegion,
  deleteRegionService,
  getAllRegionsWithPointService,
  getRegionByIdService,
  getRegionsWithADistance,
  updateRegion,
} from "../services/regionService";
import { ValidateRegionQuery } from "../validations/validateRegionQuery";

const createRegion = async (req: Request, res: Response) => {
  const newRegion = req.body;

  try {
    const createdRegion = await createNewRegion(newRegion);

    return res.status(STATUS.CREATED).json({ createdRegion: createdRegion });
  } catch (error: any) {
    res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getRegionsWithPoint = async (req: Request, res: Response) => {
  const { lat, lng, distance, fromUser, unit } = req.query;
  try {
    ValidateRegionQuery(lat, lng, distance, fromUser, unit);

    const latNumber = parseFloat(lat.toString());
    const lngNumber = parseFloat(lng.toString());
    const token = req.headers.authorization;

    const fromUserBol = fromUser === "true";

    if (!distance) {
      const regionsFound = await getAllRegionsWithPointService([
        latNumber,
        lngNumber,
      ]);

      return res.status(STATUS.OK).json(regionsFound);
    }
    const distanceNumber = parseFloat(distance.toString());

    const regionsFromDistance = await getRegionsWithADistance(
      [latNumber, lngNumber],
      fromUserBol,
      token,
      unit,
      distanceNumber
    );

    return res.status(STATUS.OK).json(regionsFromDistance);
  } catch (error) {
    return res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getRegionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const regionFound = await getRegionByIdService(id);

    return res.status(STATUS.OK).json(regionFound);
  } catch (error) {
    return res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateRegionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedRegion = await updateRegion(id, update);

    return res.status(STATUS.UPDATED).json({ updatedRegion: updatedRegion });
  } catch (error: any) {
    return res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedRegion = await deleteRegionService(id);

    return res.status(STATUS.OK).json({ deletedRegion: deletedRegion });
  } catch (error) {
    return res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export {
  createRegion,
  getRegionById,
  getRegionsWithPoint,
  updateRegionById,
  deleteRegion,
};
