import { Router } from "express";
import userRouter from "./user";
import tripRouter from "./trip";

const router = Router();

router.use(userRouter);
router.use(tripRouter);

export default router;