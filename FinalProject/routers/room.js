const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room.js");
const userController = require("../controllers/user.js");

//middleware to check if the user is authorized

router.use(userController.authorize);

router.get("", roomController.getAllRooms);
router.get("/search/:rmcode", roomController.getARoomByCode);
router.get("/filter", roomController.filterClassroom);

router.post("/reqRoom", userController.authorizeUser, roomController.requestAClass);

//middleware to check if the user role is admin or not
router.use(userController.authorizeAdmin);

router.post("/add", roomController.addNewRoom);
router.put("/:rmcode", roomController.updateRoom);
router.delete("/:rmcode", roomController.deleteRoom);
router.delete("/", userController.authorizeAdmin, roomController.clearRooms);

//These are our named exports
module.exports = router;
