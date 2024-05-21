import { Router } from "express";
import { createRegion } from "../controllers/regionController";

const router = Router();

router.post("/region", createRegion );

export default router;