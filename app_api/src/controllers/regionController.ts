import { Request, Response } from "express";
import { STATUS } from "../enums/status";
import { createNewRegion } from "../services/regionService";

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

export { createRegion };
