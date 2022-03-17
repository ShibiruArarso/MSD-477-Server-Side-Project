const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

//!You dont need to be preauthorized to login
router.post("/login", userController.login);

//! verifying Token
router.use(userController.authorize);

router.post("/signup", userController.authorizeAdmin, userController.signup);

//! Only applies to CRUD requests
router.get("/", userController.getMyUsers);
router.put("/:updatePWD", userController.userPwrdUpdate);

//router.use(userController.authorizeAdmin);
router.put("/:userCode", userController.authorizeAdmin, userController.updateUser);
router.delete("/:userCode", userController.authorizeAdmin, userController.deleteUserByUsercode);
router.delete("/userCode", userController.authorizeAdmin, userController.clearAllUsers);

module.exports = router;
