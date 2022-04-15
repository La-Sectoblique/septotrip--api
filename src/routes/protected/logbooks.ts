import { Router } from "express";
import { addEntryToLogbook, getLogbookEntry, updateLogbookEntry, deleteLogbookEntry, getTripLogbookEntries } from "../../controllers/Logbook";
import { LoadLogbookEntry } from "../../middlewares/loaders/LogbookEntryLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/trips/:tripId/logbook")
	.all(LoadTrip)
	.get(getTripLogbookEntries)
	.post(addEntryToLogbook)
	.all(MethodNotAllowed);

router.route("/logbook/:entryId")
	.all(LoadLogbookEntry)
	.get(getLogbookEntry)
	.put(updateLogbookEntry)
	.delete(deleteLogbookEntry)
	.all(MethodNotAllowed);

export default router;