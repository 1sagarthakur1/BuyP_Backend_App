const express = require("express");
const {} = require("../Service/shipping_service");
const { add_toCart, getAllItem_ofCart, remove_toCart } = require("../Service/cart_service");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.route("/Add_toCart/:product_id").post(validateToken,add_toCart);

router.route("/getAllItem_ofCart").get(validateToken,getAllItem_ofCart)

router.route("/remove_toCart/:product_id").delete(validateToken,remove_toCart)

module.exports = router;