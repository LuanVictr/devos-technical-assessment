import { Request, Response } from "express";
import {
  deleteUser,
  getAll,
  getById,
  updateUser,
  createNewUser,
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

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUser(id);

    return res.status(STATUS.OK).json({ deleted: deletedUser });
  } catch (error: any) {
    res.status(error.status).json({ message: error.message });
  }
};

const createUser = async (req: Request, res: Response) => {
  const newUser = req.body;

  try {
    const createdUser = await createNewUser(newUser);

    return res.status(STATUS.CREATED).json({ createdUser: createdUser });
  } catch (error: any) {
    res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export { getAllUsers, getUserById, updateUserById, deleteUserById, createUser };
