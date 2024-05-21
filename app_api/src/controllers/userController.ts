import { Request, Response } from "express";
import {
  getAll,
} from "../services/userService";
import { STATUS } from "../enums/status";

const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const response = await getAll(page.toString(), limit.toString());

  return res.status(STATUS.OK).json({
    rows: response.users,
    page,
    limit,
    total: response.total,
  });
};

export { getAllUsers };
