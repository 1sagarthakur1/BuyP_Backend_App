const express = require("express");
const { updateUser, getUserBy_Id, getAllUsers, deleteUserBy_Id, loginUser, currentUserinfo, logOutUser, sendOtpforRagisterUser, ragisterdUserbyOtp, sendOtpforResetPassword, resetPasswordByOtp} = require("../Service/user_service");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.route("/sendOtp_forRagister").post(sendOtpforRagisterUser);

router.route("/userRagister_ByOtp").post(ragisterdUserbyOtp);

router.route("/otp_ForResetpassword").post(sendOtpforResetPassword);

router.route("/reset_PasswordByOtp").put(resetPasswordByOtp);

router.route("/update_user").put(validateToken,updateUser);

router.route("/loginUser").post(loginUser);

router.route("/logOutUser").get(logOutUser);

router.route("/currentUser").get(validateToken, currentUserinfo)

// These api not for user side
router.route("/getUserBy_Id/:Id").get(getUserBy_Id);

router.route("/getAllUsers").get(getAllUsers);

router.route("/deleteUserBy_Id/:Id").delete(deleteUserBy_Id);



module.exports = router;