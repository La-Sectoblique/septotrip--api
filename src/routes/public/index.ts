import { Router } from "express";
import userRouter from "./user";
import tripRouter from "./trip";
import fileRouter from "./file";

const router = Router();

router.use(userRouter);
router.use(tripRouter);
router.use(fileRouter);

export default router;