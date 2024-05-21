import { Request, Response } from "express";
import {
  getAll,
  getById,
  updateUser,
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

const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedUser = await updateUser(id, update);

    return res.status(STATUS.UPDATED).json({ updatedUser: updatedUser });
  } catch (error: any) {
    res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export { getAllUsers, getUserById, updateUserById };
