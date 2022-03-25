import { Router } from "express";
import { me } from "../../controllers/User";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/me") 
	.get(me)
	.all(MethodNotAllowed);

export default router;