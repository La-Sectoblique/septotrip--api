import { Router } from "express";
import { addEntryToLogbook, getLogbookById, getLogbookEntries, getUserLogbooks, newLogbook, updateLogbook } from "../../controllers/Logbook";
import { LoadLogbook } from "../../middlewares/LogbookLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/logbooks")
	.get(getUserLogbooks)
	.post(newLogbook)
	.all(MethodNotAllowed);

router.route("/logbooks/:id")
	.all(LoadLogbook)
	.get(getLogbookById)
	.put(updateLogbook)
	.all(MethodNotAllowed);

router.route("/logbooks/:id/entries")
	.all(LoadLogbook)
	.get(getLogbookEntries)
	.post(addEntryToLogbook)
	.all(MethodNotAllowed);


export default router;