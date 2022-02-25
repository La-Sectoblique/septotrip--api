import { Router } from "express";
import NotFoundMiddleware from "../middlewares/NotFound";
import ErrorMiddleware from "../middlewares/Error";
import publicRouter from "./public";

const router = Router();

router.use("/", publicRouter);

router.use(NotFoundMiddleware);
router.use(ErrorMiddleware);

export default router;