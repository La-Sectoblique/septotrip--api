import { Router } from "express";
import { login, register } from "../../controllers/User";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/register")
	.post(register)
	.all(MethodNotAllowed);

router.route("/login")
	.post(login)
	.all(MethodNotAllowed);

export default router;