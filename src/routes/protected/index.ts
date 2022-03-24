import { Router } from "express";
import pointRouter from "./points";
import logbookRouter from "./logbooks";
import tripRouter from "./trip";
import stepRouter from "./step";
import userRouter from "./user";


const router = Router();

router.use(pointRouter);
router.use(logbookRouter);
router.use(tripRouter);
router.use(stepRouter);
router.use(userRouter);

export default router;