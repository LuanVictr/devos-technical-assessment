import { Router } from "express";
import { createRegion } from "../controllers/regionController";
import authMiddleware from "../middleware/authMiddleware";
import regionValidation from "../validations/regionValidation";

const router = Router();

router.post("/region", regionValidation.region , authMiddleware, createRegion );

export default router;