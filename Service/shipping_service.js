const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const {User, Order, Shipping } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");


// @desc Shipping Product order
// @routs POST /api/order/shipping/shipping_order/<user_id>/<order_id>
// @access pubilc
const shipping_order = asyncHandler(async (req, res) => {

    // const { product, user_id } = req.body;
    if(req.body.order_location === "DELIVERED" || req.body.order_location === "ORDERD"){
        const error = new Error("You can only shippe order, not DELIVERED or ORDERD");
        error.status = 403;
        throw error;
    }
    // console.log(req.params.user_id,req.params.order_id)

    try {
        const user = await User.findById(req.params.user_id);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const order = await Order.findOne({ user_id: req.params.user_id, _id:req.params.order_id });

        if(!order){
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }

        if(order.order_status === "CANCELLED"){
            const error = new Error("This Order has cancelled you can not shipped it");
            error.status = 403;
            throw error;
        }

        if(order.order_location === "SHIPPING"){
            const error = new Error("This Order is allready shipped");
            error.status = 403;
            throw error;
        }

        if(order.order_location === "DELIVERED"){
            const error = new Error("This Order is delivered shipped");
            error.status = 403;
            throw error;
        }

        const newDateValue = new Date();

        const shippedOrder = await Order.findByIdAndUpdate(
            req.params.order_id,
            {order_location:req.body.order_location,order_completePercent:20,e_shippingDate: newDateValue},
            { new: true, runValidators: true, }
        );

        if(!shippedOrder){
            const error = new Error("This Order not shipped");
            error.status = 403;
            throw error;
        }

        const getOrderfromShipping = await Shipping.create({
            order_id:shippedOrder,
            user_id:user
        });

        if(!getOrderfromShipping){
            const error = new Error("This Order not shipped");
            error.status = 403;
            throw error;
        }
       
        res.status(200).json({ message: `Product order shipped successfully`,getOrderfromShipping});

    } catch (err) {

        if (err instanceof mongoose.CastError && err.path === '_id') {
            const word = err.message.split(/\s+/);
            const error = new Error(word[word.length - 1] + " not found");
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




// @desc Get All Shipped Order of User
// @routs GET /api/order/shipping/getAllShipped_Order_OfUser/<user_Id>
// @access pubilc
const getAllShipped_Order = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const orders = await Shipping.find({user_id:req.params.user_id});
        
        if (orders.length === 0) {
            const error = new Error("User has no Order");
            error.status = 404;
            throw error;
        } else {
            var array = [];
            await Promise.all(orders.map(async (e) => {
                var order = await Order.find({_id:e.order_id.toString(),order_location:"SHIPPING"})

                order.map((o) => {
                    array.push(o);
                })
            }))
            res.status(200).json({ message: `All user shipped orders goted`,"Shipped Order":array, "Total shipped order":array.length})
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



module.exports = {shipping_order,getAllShipped_Order}