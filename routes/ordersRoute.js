const express = require("express");
const { orderProduct, getAllOrder_ofUser, forCancellOrder } = require("../Service/order_service");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.route("/order_Product").post(validateToken,orderProduct);

router.route("/forCancellOrder/:order_id").put(validateToken,forCancellOrder)

router.route("/getAllOrder_ofUser").get(validateToken,getAllOrder_ofUser)

module.exports = router;