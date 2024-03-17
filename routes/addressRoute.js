const express = require("express");
const { addAddress_forUser, updateUser_Address, getAll_UserAddress, delete_UserAddress, get_UserAddress_byType } = require("../Service/address_service");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.route("/add_address").post(validateToken,addAddress_forUser);

router.route("/updateUser_Address/:Type").put(validateToken,updateUser_Address);

router.route("/get_UserAddress_byType/:AddressType").get(validateToken,get_UserAddress_byType);

router.route("/getAll_UserAddress").get(validateToken,getAll_UserAddress);

router.route("/delete_UserAddess/:Type").delete(validateToken,delete_UserAddress);

module.exports = router;