import { Router } from "express";
import { getAllUsers, getUserById, updateUserById, createUser, deleteUserById } from "../controllers/userController";
import userValidation from "../validations/userValidation";
import userQueryValidation from "../validations/userQueryValidation";

const router = Router();

router.get("/user", userQueryValidation.userQuery, getAllUsers);

router.get("/user/:id", getUserById);

router.put("/user/:id", userValidation.update, updateUserById );

router.post("/user", userValidation.save, createUser);

router.delete("/user/:id", deleteUserById);

export default router;
