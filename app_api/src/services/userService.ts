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

export async function updateUser(id: string, userUpdate: IUser) {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "User not found",
    };
  }

  if (userUpdate.coordinates && userUpdate.address) {
    throw {
      status: STATUS.BAD_REQUEST,
      message: "Please insert only coordinates OR only address",
    };
  }

  userUpdate.name ? (user.name = userUpdate.name) : false;
  userUpdate.email ? (user.email = userUpdate.email) : false;
  if (userUpdate.address) {
    const coordinates = await lib.getCoordinatesFromAddress(userUpdate.address);
    user.address = userUpdate.address;
    user.coordinates = [coordinates.lat, coordinates.lng];
  }

  if (userUpdate.coordinates) {
    const address = await lib.getAddressFromCoordinates(userUpdate.coordinates);
    user.coordinates = userUpdate.coordinates;
    user.address = address;
  }
  
  await user.save();

  return user;
}

export async function deleteUser(id: string) {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "User not found",
    };
  }

  await user.deleteOne();

  return user;
}
