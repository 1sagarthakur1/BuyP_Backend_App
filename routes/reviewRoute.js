const express = require("express");
const {} = require("../Service/shipping_service");
const validateToken = require("../middleware/validateTokenHandler");
const { giveReview, getAllReview_ofUser, getAllProduct_reviews, remove_review } = require("../Service/review_service");
const router = express.Router();


router.route("/giveReview_forProduct").post(validateToken,giveReview);

router.route("/getAllReview_ofUser").get(validateToken,getAllReview_ofUser);


// These api not for user side
router.route("/getAllProduct_reviews/:product_id").get(getAllProduct_reviews);

router.route("/remove_review/:product_id/:review_id").delete(remove_review)

module.exports = router;