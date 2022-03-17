const mongoose = require("mongoose");

const SlotSchema = mongoose.Schema(
   {
      // required
      number: { type: Number, required: true, unique: true }, //required
      status: { type: String, required: true }, //required. There are two statuses: busy, available.
      usedBy: { type: String }, // required
   },
   { timestamps: true }
);

const RoomSchema = mongoose.Schema(
   {
      rmcode: { type: Number, required: true, unique: true }, // required
      slots: [SlotSchema], // required
   },
   { timestamps: true }
);

const RoomModel = mongoose.model("room", RoomSchema);

class Room {
   constructor(rmcode = "", slots = []) {
      this.rmcode = rmcode;
      this.slots = slots;
   }
   // return all rooms from the DB
   async getAllRooms() {
      const document = await RoomModel.find();
      return document;
   }

   async getARoomByCode(givenRmCode) {
      const document = await RoomModel.findOne({ rmcode: givenRmCode });
      return document;
   }
   async filterClassroom(status, slotNumber) {
      const document = await RoomModel.find();
      let response = [];
      if (status)
         response = document.filter((room) => room.slots.filter((slot) => slot.status === status));
      if (slotNumber)
         response = response.filter((room) =>
            room.slots.filter((slot) => slot.number === slotNumber)
         );
      return response;
   }

   async save() {
      const room = new RoomModel(this);
      await room.save();
      return true;
   }

   async updateRoom(givenRmcode) {
      const room = await this.getARoomByCode(givenRmcode);
      if (room) {
         await RoomModel.updateOne({ rmcode: givenRmcode }, this);
         return true;
      }
      return false;
   }

   async deleteRoom(givenRmcode) {
      const room = await this.getARoomByCode(givenRmcode);
      if (room) {
         await RoomModel.deleteOne({ rmcode: givenRmcode });
         return true;
      }
      return false;
   }

   async clearRooms() {
      const response = await RoomModel.deleteMany();
      if (response) return true;
      else return false;
   }

   async addSlot(givenRmcode, number, status, usedBy) {
      const room = await this.getARoomByCode(givenRmcode);
      if (room) {
         room.slots = [...room.slots, { number: number, status: status, usedBy: usedBy }];
      }
      return false;
   }

   async requestClassRoom(givenRmcode, slotNumber, requestingUser) {
      const room = await this.getARoomByCode(givenRmcode);
      if (room) {
         const slot = room.slots.find((e) => e.number === slotNumber);
         if (slot && slot.status === "available") {
            slot.status = "busy";
            slot.usedBy = requestingUser.userCode;
            await room.save();
            return true;
         }
         return false;
      }
      return false;
   }

   async classRoomComplete(givenRmcode, slotNumber) {
      const room = await this.getARoomByCode(givenRmcode);
      if (room) {
         const slot = await room.slots.find((e) => e.number === slotNumber);
         if (slot && slot.status === "busy") {
            slot.status = "available";
            slot.usedBy = null;
            await room.save();
            return true;
         }
         return false;
      }
      return false;
   }
}

module.exports = Room;
