const express = require("express");
const { add_category, getAllCategory } = require("../Service/category-service");
// const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.route("/getAll_Category").get(getAllCategory);


// Theese api not for user side
router.route("/add_category").post(add_category);

// router.route("/deleteCategory/:category_id").delete()

// router.route("/updateCategory/:category_id").put()

// router.route("/getCategoryBy_Id/:category_id").get()

module.exports = router;