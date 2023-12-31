const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");

router.delete("/", userController.removeAllusers);

router.get("/GetWholeTable", userController.GetWholeTable);

router.get("/getuserwithCondition", userController.getuserswithCondition);

router.post("/AddNewuser", userController.AddNewuser);
router.put("/Updateuser", userController.Updateusers);

router.delete("/DeleteuserAtID", userController.DeleteUserAtID);
router.delete(
  "/DeleteuserWithCondition",
  userController.DeleteUserWithCondition
);

router.get("/findIDfromusername", userController.FindIDfromUsername);

router.get("/DoesUserExist", userController.DoesUserExist);

module.exports = router;
