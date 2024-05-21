import { STATUS } from "../enums/status";
import { IUser } from "../interfaces/IUser";
import { UserModel } from "../models/models";
import { generateToken } from "../utils/jwt";

export async function authUser(userToLogin: IUser) {
  const user = await UserModel.findOne({
    name: userToLogin.name,
    email: userToLogin.email,
  });

  if (!user) {
    throw {
      status: STATUS.NOT_FOUND,
      message: "User not found",
    };
  }

  return generateToken({_id: user.id})
}