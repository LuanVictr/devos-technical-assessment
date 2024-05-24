import { Request, Response } from "express";
import { STATUS } from "../enums/status";
import {
  createNewRegion,
  deleteRegionService,
  getRegionByIdService,
  updateRegion,
} from "../services/regionService";

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

export { createRegion, getRegionById, updateRegionById, deleteRegion };
