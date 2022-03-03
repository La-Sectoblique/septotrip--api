import { Router } from "express";
import pointRouter from "./points";

const router = Router();

router.use(pointRouter);

export default router;