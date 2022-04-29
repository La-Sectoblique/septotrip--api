import { Router } from "express";
import { addTodoEntry, deleteTodoEntry, getTodoEntryById, getTripTodoList, updateTodoEntry } from "../../controllers/Todo";
import { LoadTodoEntry } from "../../middlewares/loaders/TodoEntryLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";


const router = Router();

router.route("/trips/:tripId/todo")
	.all(LoadTrip)
	.get(getTripTodoList)
	.post(addTodoEntry)
	.all(MethodNotAllowed);

router.route("/todo/:todoEntryId")
	.all(LoadTodoEntry)
	.get(getTodoEntryById)
	.put(updateTodoEntry)
	.delete(deleteTodoEntry)
	.all(MethodNotAllowed);


export default router;