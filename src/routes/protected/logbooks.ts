import { Router } from "express";
import { addEntryToLogbook, getLogbookById, getLogbookEntries, getUserLogbooks, newLogbook, updateLogbook, getLogbookEntry, updateLogbookEntry, deleteLogbookEntry, deleteLogbook, getTripLogbooks } from "../../controllers/Logbook";
import { LoadLogbookEntry } from "../../middlewares/loaders/LogbookEntryLoader";
import { LoadLogbook } from "../../middlewares/loaders/LogbookLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/logbooks")
	.get(getUserLogbooks)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/logbooks")
	.all(LoadTrip)
	.get(getTripLogbooks)
	.post(newLogbook)
	.all(MethodNotAllowed);
	
router.route("/logbooks/:logbookId")
	.all(LoadLogbook)
	.get(getLogbookById)
	.put(updateLogbook)
	.delete(deleteLogbook)
	.all(MethodNotAllowed);

router.route("/logbooks/:logbookId/entries")
	.all(LoadLogbook)
	.get(getLogbookEntries)
	.post(addEntryToLogbook)
	.all(MethodNotAllowed);

router.route("/logbooks/:logbookId/entries/:entryId")
	.all(LoadLogbook)
	.all(LoadLogbookEntry)
	.get(getLogbookEntry)
	.put(updateLogbookEntry)
	.delete(deleteLogbookEntry)
	.all(MethodNotAllowed);

export default router;