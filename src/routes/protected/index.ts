import { Router } from "express";
import pointRouter from "./points";
import logbookRouter from "./logbooks";
import tripRouter from "./trip";
import stepRouter from "./step";
import userRouter from "./user";
import dayRouter from "./day";
import spentRouter from "./spent";
import todoRouter from "./todo";

const router = Router();

router.use(pointRouter);
router.use(logbookRouter);
router.use(tripRouter);
router.use(stepRouter);
router.use(userRouter);
router.use(dayRouter);
router.use(spentRouter);
router.use(todoRouter);

export default router;