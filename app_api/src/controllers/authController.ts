import { Request, Response } from "express";
import { STATUS } from "../enums/status";
import { authUser } from "../services/authService";

const authUserController = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    const token = await authUser(user);

    return res.status(STATUS.OK).json({ token: token });
  } catch (error: any) {
    res
      .status(error.status ? error.status : STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export { authUserController };
