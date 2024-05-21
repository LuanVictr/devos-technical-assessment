import { STATUS } from "../enums/status";
import { IUser } from "../interfaces/IUser";
import { UserModel } from "../models/models";
import lib from "../services/lib";

export async function getAll(page: string, limit: string) {
  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.count(),
  ]);

  return {
    users,
    total,
  };
}

export async function getById(id: string) {
  const user = await UserModel.findOne({ _id: id }).lean();

  return user;
}

export async function createNewUser(newUser: IUser) {
  if (!newUser) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "User info is missing on request body",
    };
  }
  const createdUser = await UserModel.create(newUser);

  return { message: "User created successfully", user: createdUser };
}