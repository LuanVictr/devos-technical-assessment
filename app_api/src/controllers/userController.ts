import { Request, Response } from "express";
import {
  getAll,
  getById,
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

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getById(id);

  if (!user) {
    return res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
  }

  return res.status(STATUS.OK).json(user);
};

export { getAllUsers, getUserById };
