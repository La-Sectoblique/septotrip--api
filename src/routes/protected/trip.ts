import { Router } from "express";
import { deleteFile, getFileMetadata, getTripFiles, updateMetadata, uploadFile } from "../../controllers/File";
import { createTrip, deleteTrip, updateTrip, getSpecificTrip, getTripUsers, addingMemberToTrip, removeMemberFromTrip, getUserTrips, getTripAuthor } from "../../controllers/Trip";
import { LoadFileMetadata } from "../../middlewares/loaders/FileMetadataLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/trips")
	.post(createTrip)
	.all(MethodNotAllowed);

router.route("/trips/me")
	.get(getUserTrips)
	.all(MethodNotAllowed);

router.route("/trips/:tripId")
	.all(LoadTrip)
	.get(getSpecificTrip)
	.put(updateTrip)
	.delete(deleteTrip)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/users")
	.all(LoadTrip)
	.get(getTripUsers)
	.post(addingMemberToTrip)
	.all(MethodNotAllowed);
	
router.route("/trips/:tripId/users/:userId")
	.all(LoadTrip)
	.delete(removeMemberFromTrip)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/files")
	.all(LoadTrip)
	.get(getTripFiles)
	.post(uploadFile)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/files/:fileId")
	.all(LoadTrip)
	.all(LoadFileMetadata)
	.get(getFileMetadata)
	.put(updateMetadata)
	.delete(deleteFile)
	.all(MethodNotAllowed);

export default router;