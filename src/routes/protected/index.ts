import { Router } from "express";
import pointRouter from "./points";
import logbookRouter from "./logbooks";
import tripRouter from "./trip";

const router = Router();

router.use(pointRouter);
router.use(logbookRouter);
router.use(tripRouter);

export default router;