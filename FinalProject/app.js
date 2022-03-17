const express = require("express");
const roomRouter = require("./routers/room.js");
const userController = require("./controllers/user.js");
const userRouter = require("./routers/user.js");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27020/finalProject", (err) => {
   if (err) {
      console.log("DB error", err);
   } else {
      console.log("DB Connected");
   }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/rooms", roomRouter);

//! Error handler
app.use((err, req, res, next) => {
   res.send(err);
});

app.listen(3000, () => {
   console.log("Listening on port 3000 ");

   //!This is where the default admin is initialized if no users exist in the db
   userController.initializeAdmin();
});
