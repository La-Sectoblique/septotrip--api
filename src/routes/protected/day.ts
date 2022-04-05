import { Router } from "express";
import { getDayByID, updateDay } from "../../controllers/Day";
import { getPointsByDay } from "../../controllers/Point";
import { LoadDay } from "../../middlewares/loaders/DayLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";



const router = Router();

router.route("/days/:dayId") 
	.all(LoadDay)
	.get(getDayByID)
	.put(updateDay)
	.all(MethodNotAllowed);

router.route("/days/:dayId/points")
	.all(LoadDay)
	.get(getPointsByDay)
	.all(MethodNotAllowed);

export default router;