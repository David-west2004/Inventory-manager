const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/user", userController.createUser);
router.get("/user", userController.getUsers);
router.get("/user/:id", userController.getUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

//login
router.post("/user/login", userController.loginUser);

module.exports = router;