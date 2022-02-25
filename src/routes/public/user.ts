import { Router } from "express";
import { register } from "../../controllers/User";

const router = Router();

router.post("/register", register);

export default router;