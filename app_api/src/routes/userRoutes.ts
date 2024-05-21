import { Router } from "express";
import { getAllUsers, getUserById, updateUserById, createUser, deleteUserById } from "../controllers/userController";
import userValidation from "../validations/userValidation";
import userQueryValidation from "../validations/userQueryValidation";

const router = Router();

router.get("/user", userQueryValidation.userQuery, getAllUsers);

router.get("/user/:id", getUserById);

router.put("/user/:id", updateUserById );

router.post("/user", userValidation.user, createUser);

router.delete("/user/:id", deleteUserById);

export default router;
