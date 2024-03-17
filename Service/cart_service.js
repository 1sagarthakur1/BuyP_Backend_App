const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { Product, User, Order, Payment, Address, Cart } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");

// @desc Add to cart
// @routs POST /api/user/cart/Add_toCart/<user:id>/<product:id>
// @access pubilc
const add_toCart = asyncHandler(async (req, res) => {

    // const { product_id , user_id } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const existProduct = await Product.findById(req.params.product_id);
        if (!existProduct) {
            const error = new Error("This Product not avilable");
            error.status = 404;
            throw error;
        }

        const existProduct_inCart = await Cart.findOne({user_id:user,product_id:existProduct});
        // console.log(existProduct_inCart);
        if(existProduct_inCart){
            const error = new Error("This Product allready in cart");
            error.status = 404;
            throw error;
        }

        if (user && existProduct) {

            if(existProduct.quantity <= 0){
                const error = new Error("This Product is out of stock");
                error.status = 403;
                throw error;
            }

            const orderProduct = await Cart.create({
                user_id:user,product_id:existProduct
            });

            if(!orderProduct){
                const error = new Error("Product not added, Try again");
                error.status = 403;
                throw error;
            }

            res.status(200).json({ message: "Add to cart successfully", orderProduct});
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
// @routs GET /api/user/cart/getAllItem_ofCart/<user_Id>
// @access pubilc
const getAllItem_ofCart = asyncHandler(async (req, res) => {

    try {

        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const cart = await Cart.find({ user_id: req.user.id});

        if (cart.length === 0) {
            const error = new Error("Card is empty");
            error.status = 403;
            throw error;
        } else {

            var array = [];
            var totalPrice = 0;
            await Promise.all(cart.map(async (e) => {
                var order = await Product.findById({_id:e.product_id.toString()})
                totalPrice += order.price
                array.push(order);
            }))
            
            res.status(200).json({ message: `All Card Item goted`, array, "user name": user.username, "Total_card_item":array.length,"Total_price":totalPrice})
        }

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




// @desc  Revomve Item to cart
// @routs GET /api/user/cart/remove_toCart/<user_Id>/<product_id>
// @access pubilc
const remove_toCart = asyncHandler(async (req, res) => {

    try {

        const existProduct_inCart = await Cart.findOne({user_id:req.user.id,product_id:req.params.product_id});
        if(!existProduct_inCart){
            const error = new Error("This Product not in cart");
            error.status = 404;
            throw error;
        }

        const deletedItem = await Cart.findByIdAndDelete(existProduct_inCart._id);

        if(!deletedItem){
            const error = new Error("This Product not removed, Try again");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "Item removed to cart successfully", deletedItem});

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Item not found");
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



module.exports = { add_toCart, getAllItem_ofCart, remove_toCart}