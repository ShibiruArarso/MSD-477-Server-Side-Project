const Room = require("../models/room");
const dummy = new Room();

exports.getAllRooms = async (req, res) => {
   const rooms = await dummy.getAllRooms();
   if (rooms.length === 0) res.status(404).send("No Rooms Found");
   await res.status(200).send(rooms);
};
exports.getARoomByCode = async (req, res) => {
   const room = await dummy.getARoomByCode(parseInt(req.params.rmcode));
   if (!room) {
      res.status(404).send("Room not found");
   } else {
      await res.status(200).send(room);
   }
};
exports.filterClassroom = async (req, res) => {
   const rooms = await dummy.filterClassroom(req.query.status, req.query.slotNumber);
   if (rooms.length === 0) res.status(404).send("No rooms match");
   await res.status(200).send(rooms);
};
exports.addNewRoom = async (req, res) => {
   const { rmcode, slots } = req.body;
   const newRoom = new Room(rmcode, slots);
   const existing = await newRoom.getARoomByCode(rmcode);
   if (existing) {
      res.status(409).send(
         "This Room is already exist, please use updateRoom instead of create a room"
      );
   } else {
      await newRoom.save();
      res.status(201).send("The new room added Successfully");
   }
};

exports.updateRoom = async (req, res) => {
   const { rmcode, slots, status, usedBy } = req.body;
   const newRoom = new Room(parseInt(rmcode), slots, status, parseInt(usedBy));
   let response = " ";
   response = await newRoom.updateRoom();
   if (response) res.status(201).send("updated successfully");
   else res.status(400).send("update failed");
};
exports.requestAClass = async (req, res) => {
   const { rmcode, slotNumber, status } = req.body;
   let response = " ";
   if (status === "requested") {
      response = await dummy.requestClassRoom(parseInt(rmcode), slotNumber, req.user);
   }
   if (status === "completed") {
      response = await dummy.classRoomComplete(parseInt(rmcode), slotNumber);
   }
   if (response) {
      res.status(201).send("request successful");
   } else {
      res.status(400).send("request failed");
   }
};

exports.deleteRoom = async (req, res) => {
   let result = " ";
   result = await dummy.deleteRoom(req.params.rmcode);
   if (result) res.status(201).send("deleted successfully");
   else res.status(400).send("delete failed");
};

exports.clearRooms = async (req, res) => {
   let result = " ";
   result = await dummy.clearRooms();
   if (result) res.status(201).send("deleted successfully");
   else res.status(400).send("delete failed");
};
