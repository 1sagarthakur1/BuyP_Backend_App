const express = require("express");
const {} = require("../Service/shipping_service");
const { delivered_Order, getAllDelivered_Order } = require("../Service/delivery_service");
// const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

// Thease api not for user side
router.route("/delivery_Order/:user_id/:order_id").post(delivered_Order);

router.route("/getAllDelivered_Order/:user_id").get(getAllDelivered_Order)

module.exports = router;