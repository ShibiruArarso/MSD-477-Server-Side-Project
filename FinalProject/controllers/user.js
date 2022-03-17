const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const dummy = new User();
let PRIVATE_KEY = "msd-SSP";

exports.login = async (req, res, next) => {
   console.log("Hello");
   const { userCode, name, password, role } = req.body;
   if (userCode && password) {
      const user = await dummy.getAUserByCode(userCode);

      if (user) {
         if (bcrypt.compareSync(password, user.password)) {
            //!Create access token here
            const accessToken = jwt.sign({ userCode, role: user.role }, PRIVATE_KEY, {
               expiresIn: "1h",
            });
            res.status(200).send(accessToken);
         } else {
            res.status(400).send("Wrong password");
         }
      } else {
         res.status(404).send("The user is not found");
      }
   } else {
      res.status(400).send("Please provide the userCode and password");
   }
};

exports.authorize = (req, res, next) => {
   let authHeader = req.headers.authorization;

   if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
         let payload = jwt.verify(token, PRIVATE_KEY);
         req.user = payload;
         next();
      } catch (error) {
         res.send("error");
      }
   } else {
      res.send(" Un-authorized");
   }
};

// exports.authorize = (req, res, next) => {
//    const authHeader = req.headers.authorization;
//    if (authHeader) {
//       const token = authHeader.split(" ")[1];
//       jwt.verify(token, PRIVATE_KEY, (err, user) => {
//          req.user = user;
//          if (err) {
//             if (err.message.includes("expired")) {
//                res.status(408).send("Timeout: please login again");
//             } else {
//                return res.status(403).send("Access denied / Forbidden");
//             }
//          } else {
//             next();
//          }
//       });
//    } else {
//       return res.status(401).json({ error: "Unauthorized" });
//    }
// };

exports.authorizeAdmin = (req, res, next) => {
   if (req.user.role === "admin") {
      next();
   } else {
      res.status(401).send("Un-authorized " + JSON.stringify(req.user.role));
   }
};
exports.authorizeUser = (req, res, next) => {
   if (req.user.role === "user") {
      next();
   } else {
      res.status(401).send("Un-authorized " + JSON.stringify(req.user.role));
   }
};
exports.userPwrdUpdate = async (req, res, next) => {
   let userCode = req.params.updatePWD;
   const { password } = req.body;
   if (!userCode) {
      res.status(404).send("Not found");
   } else {
      let user = new User("", "", bcrypt.hashSync(password, 10), "");
      let response = await user.updatePdw(userCode);
      if (response) {
         res.status(201).send("updated successfully");
      } else {
         res.status(400).send("update failed");
      }
   }
};

exports.signup = async (req, res) => {
   console.log("signup here");
   const { userCode, name, password, role } = req.body;
   const newUser = new User(userCode, name, bcrypt.hashSync(password, 10), role);
   const repeatedCheck = await dummy.getAUserByCode(userCode);

   if (repeatedCheck) {
      res.status(409).send("The user already has an account");
   } else {
      newUser.saveUser();
      res.status(201).send("Successfully signup");
   }
};

exports.getAUserByCode = async (req, res) => {
   let user = await dummy.getAUserByCode(req.params.userCode);
   if (user) {
      res.status(200).send(user);
   } else {
      res.status(404).send("Not found");
   }
};
exports.getMyUsers = async (req, res) => {
   let user = await dummy.getAll();
   if (user) {
      res.status(200).send(user);
   } else {
      res.status(404).send("Not found");
   }
};

exports.updateUser = async (req, res) => {
   let giveCode = req.params.userCode;
   const { userCode, name, password, role } = req.body;
   let newUser = new User(userCode, name, password, role);
   let response = await newUser.update(giveCode);
   if (response) {
      res.status(201).send("updated successfully");
   } else {
      res.status(400).send("update failed");
   }
};

// exports.deleteUserByUsercode = async (req, res) => {
//    let giveCode = req.params.userCode;
//    const { userCode, name, password, role } = req.body;
//    let newUser = new User(userCode, name, password, role);
//    let response = await newUser.delete(giveCode);
//    if (response) {
//       res.status(201).send("Deleted successfully");
//    } else {
//       res.status(400).send("Delete failed");
//    }
// };

exports.deleteUserByUsercode = async (req, res) => {
   let giveCode = req.params.userCode;
   var isDelete = await dummy.delete(giveCode);
   if (isDelete) {
      res.send("Deleted");
   } else {
      res.send("Not found");
   }
};

exports.clearAllUsers = async (req, res) => {
   let response = await dummy.clearUsers();
   if (response) {
      res.status(201).send("All successfully Deleted ");
   } else {
      res.status(400).send("Delete failed");
   }
};

//! when we start to signUp new user, our App create Admin by difault
exports.initializeAdmin = async (req, res) => {
   let response = await dummy.getAll();
   if (response.length === 0) {
      const userCode = 0;
      const name = "Administrator";
      const password = "ADMINPASS";
      const role = "admin";
      const newUser = new User(userCode, name, bcrypt.hashSync(password, 10), role);
      await newUser.saveUser();
      console.log("ADMIN INITIALIZED");
   }
};
