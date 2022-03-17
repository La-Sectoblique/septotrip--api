import { Router } from "express";
import { addEntryToLogbook, getLogbookById, getLogbookEntries, getUserLogbooks, newLogbook, updateLogbook, getLogbookEntry, updateLogbookEntry, deleteLogbookEntry } from "../../controllers/Logbook";
import { LoadLogbookEntry } from "../../middlewares/loaders/LogbookEntryLoader";
import { LoadLogbook } from "../../middlewares/loaders/LogbookLoader";
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

router.route("/logbooks/:id/entries/:entryId")
	.all(LoadLogbook)
	.all(LoadLogbookEntry)
	.get(getLogbookEntry)
	.put(updateLogbookEntry)
	.delete(deleteLogbookEntry)
	.all(MethodNotAllowed);

export default router;