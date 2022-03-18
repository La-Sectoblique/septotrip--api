import { Router } from "express";
import { getAllPublicTrips } from "../../controllers/Trip";

const router = Router();

router.route("/trips")
	.get(getAllPublicTrips);


export default router;