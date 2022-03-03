import { Router } from "express";
import NotFoundMiddleware from "../middlewares/NotFound";
import ErrorMiddleware from "../middlewares/Error";
import publicRouter from "./public";
import protectedRouter from "./protected";
import { JWTVerification } from "../middlewares/JWTVerification";

const router = Router();

router.use(publicRouter);

router.use(JWTVerification);

router.use(protectedRouter);

router.use(NotFoundMiddleware);
router.use(ErrorMiddleware);

export default router;