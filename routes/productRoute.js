const express = require("express");
const { addProduct, getAllProduct, update_product, searchProduct_byName, deletedProduct_ByName, getProduct_ById } = require("../Service/product_service");
// const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();




router.route("/searchProduct_byName").get(searchProduct_byName)

// Thease api not for user side
router.route("/add_porduct").post(addProduct);

router.route("/update_Product/:Id").put(update_product)

router.route("/getAll_Product").get(getAllProduct)

router.route("/getProduct_byId/:product_id").get(getProduct_ById)

router.route("/deleteUserBy_Id/:Name").delete(deletedProduct_ByName)

// router.route("/current").get(validateToken,currentUserinfo)
module.exports = router;