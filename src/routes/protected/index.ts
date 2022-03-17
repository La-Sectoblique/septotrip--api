import { Router } from "express";
import pointRouter from "./points";
import logbookRouter from "./logbooks";

const router = Router();

router.use(pointRouter);
router.use(logbookRouter);

export default router;