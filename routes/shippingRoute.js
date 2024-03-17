const express = require("express");
const { shipping_order, getAllShipped_Order } = require("../Service/shipping_service");
// const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

// Thease api not for user side
router.route("/shipping_order/:user_id/:order_id").put(shipping_order);

router.route("/getAllShipped_Order_OfUser/:user_id").get(getAllShipped_Order)

module.exports = router;