import { Request, Response, Router } from "express";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/private")
	.get((request: Request, response: Response) => response.json({ oui: "stiti" }))
	.all(MethodNotAllowed);

export default router;