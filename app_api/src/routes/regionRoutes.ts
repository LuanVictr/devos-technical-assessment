import { Router } from "express";
import { createRegion, deleteRegion, getRegionById, updateRegionById } from "../controllers/regionController";
import authMiddleware from "../middleware/authMiddleware";
import regionValidation from "../validations/regionValidation";

const router = Router();

router.get("/region/:id", authMiddleware, getRegionById);
router.post("/region", regionValidation.save , authMiddleware, createRegion );
router.put("/region/:id", regionValidation.update, authMiddleware, updateRegionById);
router.delete("/region/:id", authMiddleware, deleteRegion);

export default router;