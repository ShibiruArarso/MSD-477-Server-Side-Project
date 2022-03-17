const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
   userCode: { type: String, required: true, unique: true },
   name: { type: String, required: true },
   password: { type: String, required: true },
   role: { type: String, required: true },
});

const UserModel = mongoose.model("User", UserSchema);

class User {
   constructor(userCode, name, password, role) {
      this.userCode = userCode;
      this.name = name;
      this.password = password;
      this.role = role;
   }
   async getAll() {
      const documents = await UserModel.find();
      return documents;
   }

   async getAUserByCode(givenCode) {
      const document = await UserModel.findOne({ userCode: givenCode });
      return document;
   }
   async saveUser() {
      const user = await UserModel(this);
      await user.save();
   }

   async update(givenCode) {
      const user = await this.getAUserByCode(givenCode);
      if (user) {
         await UserModel.updateOne({ userCode: givenCode }, this);
         return true;
      }
      return false;
   }
   async updatePWD(givenCode) {
      const user = await UserModel.findOne({ userCode: givenCode });
      if (user) {
         await user.updateOne({ password: this.password });
         return true;
      }
      return false;
   }

   // async delete(givenCode) {
   //    const user = await this.getUserByUsername(givenCode);
   //    if (user) {
   //       await UserModel.deleteOne({ userCode: givenCode });
   //       return true;
   //    } else {
   //       return false;
   //    }
   // }

   //OR Delete this way also
   async deleteOneUser(givenCode) {
      try {
         await UserModel.deleteOne({ userCode: givenCode });
         return true;
      } catch (error) {
         return false;
      }
   }

   async clearUsers() {
      const response = await UserModel.deleteMany();
      if (response) {
         return true;
      } else {
         return false;
      }
   }
}

module.exports = User;
