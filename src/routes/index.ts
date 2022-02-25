import { Router } from "express";
import publicRouter from "./public";

const router = Router();

router.use("/", publicRouter);

export default router;