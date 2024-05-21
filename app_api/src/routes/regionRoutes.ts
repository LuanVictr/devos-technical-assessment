import { Router } from "express";
import { createRegion } from "../controllers/regionController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/region", authMiddleware, createRegion );

export default router;