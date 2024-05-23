import { Router } from "express";
import { createRegion, getRegionById } from "../controllers/regionController";
import authMiddleware from "../middleware/authMiddleware";
import regionValidation from "../validations/regionValidation";

const router = Router();

router.get("/region/:id", authMiddleware, getRegionById);
router.post("/region", regionValidation.region , authMiddleware, createRegion );

export default router;