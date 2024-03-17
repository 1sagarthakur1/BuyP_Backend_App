const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { Product, User, Order, Payment, Address, Cart, Review } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");

// @desc Add to cart
// @routs POST /api/user/cart/giveReview_forProduct
// @access pubilc
const giveReview = asyncHandler(async (req, res) => {

    const {image, description, rating, order_id} = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const existOrder = await Order.findOne({user_id:req.user.id,_id:order_id});
        // console.log(existOrder);

        if(!existOrder){
            const error = new Error("first order this Product, after deliverd you can give review");
            error.status = 403;
            throw error;
        }

        if(existOrder.order_location !== "DELIVERED"){
            const error = new Error("After delivered you can give review");
            error.status = 403;
            throw error;
        }

        const existReview = await Review.findOne({user_id:user.id,product_id:existOrder.product.product_id});

        if(existReview){
            const error = new Error("you all ready given review");
            error.status = 403;
            throw error;
        }

        if (existOrder && !existReview) {

            const review = await Review.create({
                image,description,rating,user_id:user.id,product_id:existOrder.product.product_id
            });

            if(!review){
                const error = new Error("Review not added, Try again");
                error.status = 403;
                throw error;
            }

            res.status(200).json({ message: "Review given successfully",review});
        }   

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }
        else {
            if (err._message !== undefined) {
                const error = new Error(err.message);
                error.status = 400;
                throw error;
            } else {
                const error = new Error(err.message);
                error.status = err.status;
                throw error;
            }
        }
    }
});





// @desc Get All Item of cart
// @routs GET /api/user/review/getAllReview_ofUser
// @access pubilc
const getAllReview_ofUser = asyncHandler(async (req, res) => {

    try {

        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const Allreview = await Review.find({ user_id: req.user.id});

        if (Allreview.length === 0) {
            const error = new Error("User has no review");
            error.status = 403;
            throw error;
        }
            
        res.status(200).json({ message: `All review of user`, Allreview, "user name": user.username, "Total review":Allreview.length})

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        else {
            if (err._message !== undefined) {
                const error = new Error(err.message);
                error.status = 400;
                throw error;
            } else {
                const error = new Error(err.message);
                error.status = err.status;
                throw error;
            }
        }
    }
});




// @desc Get All Item of cart
// @routs GET /api/user/review/getAllProduct_reviews/<product_id>
// @access pubilc
const getAllProduct_reviews = asyncHandler(async (req, res) => {

    try {
        const product = await Product.findById(req.params.product_id);

        if(!product){
            const error = new Error("Product not found");
            error.status = 403;
            throw error;
        }

        const Allreview = await Review.find({ product_id: req.params.product_id});

        if (Allreview.length === 0) {
            const error = new Error("Product has no review");
            error.status = 403;
            throw error;
        }
            
        res.status(200).json({ message: `All review of user`, product, Allreview, "Total review":Allreview.length})

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }
        else {
            if (err._message !== undefined) {
                const error = new Error(err.message);
                error.status = 400;
                throw error;
            } else {
                const error = new Error(err.message);
                error.status = err.status;
                throw error;
            }
        }
    }
});




// @desc  Revomve review 
// @routs DELETE /api/user/review/remove_review/<product_id>/<review_id>
// @access pubilc
const remove_review = asyncHandler(async (req, res) => {

    try {

        const product = await Product.findById(req.params.product_id);

        if(!product){
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }

        const deletedReview = await Review.findByIdAndDelete(req.params.review_id);

        if(!deletedReview){
            const error = new Error("Review not deleted some thing is worng, Try again");
            error.status = 403;
            throw error;
        }

        res.status(200).json({ message: "Review removed successfully", deletedReview});

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }
        else {
            if (err._message !== undefined) {
                const error = new Error(err.message);
                error.status = 400;
                throw error;
            } else {
                const error = new Error(err.message);
                error.status = err.status;
                throw error;
            }
        }
    }
});



module.exports = {giveReview, getAllReview_ofUser, getAllProduct_reviews, remove_review}