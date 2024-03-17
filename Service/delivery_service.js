const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { User, Order, Shipping, Delivery, Payment } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");


// @desc Delivery Product order
// @routs POST /api/order/delivery/delivered_Order/<user_id>/<order_id>
// @access pubilc
const delivered_Order = asyncHandler(async (req, res) => {

    const { sender_account, sender_UPI, sender_CARD, payment_type, order_id, user_id } = req.body;

    if (req.body.order_location !== "DELIVERED") {
        const error = new Error("You can only delevered order, not SHIPPING or ORDERD");
        error.status = 403;
        throw error;
    }

    try {
        const user = await User.findById(req.params.user_id);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const order = await Order.findOne({ user_id: req.params.user_id, _id: req.params.order_id });

        if (!order) {
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }

        if (order.order_status === "CANCELLED") {
            const error = new Error("This Order has cancelled");
            error.status = 403;
            throw error;
        }

        if (order.order_location === "DELIVERED") {
            const error = new Error("This Order is delivered");
            error.status = 403;
            throw error;
        }

        if (order.order_location !== "SHIPPING") {
            const error = new Error("First shippe this Order");
            error.status = 403;
            throw error;
        }

        const newDateValue = new Date();

        if (order.payment_type === "COD") {

            const delivered_order = await Order.findByIdAndUpdate(
                req.params.order_id,
                { order_location: req.body.order_location,order_completePercent:100,e_deliveryDate: newDateValue },
                { new: true, runValidators: true, }
            );

            const getOrderfromDelivery = await Delivery.create({
                order_id: delivered_order,
                user_id: user
            });

            if (!delivered_order && !getOrderfromDelivery) {
                const error = new Error("This Order not delivered, Try again");
                error.status = 403;
                throw error;
            }

            const payment = await Payment.create({
                payment: delivered_order.totalPrice,
                sender_account: null,
                sender_UPI: null,
                sender_CARD: null,
                payment_type: delivered_order.payment_type,
                order_id: delivered_order,
                user_id: user
            })


            if (!payment) {
                const ordersRemoved = await Delivery.findByIdAndDelete(order._id);

                const changeStatus = await Order.findByIdAndUpdate(
                    order._id,
                    { order_location: "SHIPPING",order_completePercent:30},
                    { new: true, runValidators: true, }
                );

                const error = new Error("This Order not delivered, Try again");
                error.status = 403;
                throw error;
            }

            res.status(200).json({ message: `Product delivered successfully`, delivered_order });

        } else {

            const delivered_order = await Order.findByIdAndUpdate(
                req.params.order_id,
                { order_location: req.body.order_location, order_completePercent:100,e_deliveryDate: newDateValue },
                { new: true, runValidators: true, }
            );

            if (!delivered_order) {
                const error = new Error("This Order not delivered, Try again");
                error.status = 403;
                throw error;
            }

            const getOrderfromDelivery = await Delivery.create({
                order_id: delivered_order,
                user_id: user
            });

            if (!getOrderfromDelivery) {
                const error = new Error("This Order not delivered, Try again");
                error.status = 403;
                throw error;
            }

            if (!delivered_order && !getOrderfromDelivery) {
                const error = new Error("This Order not delivered, Try again");
                error.status = 403;
                throw error;
            }

            res.status(200).json({ message: `Product delivered successfully`, delivered_order });
        }

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
// @routs GET /api/order/delivery/getAllDelivered_Order/<user_Id>
// @access pubilc
const getAllDelivered_Order = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const orders = await Delivery.find({user_id:req.params.user_id});
        console.log(orders);
        if (orders.length === 0) {
            const error = new Error("User has no Order");
            error.status = 404;
            throw error;
        } else {
            var array = [];
            await Promise.all(orders.map(async (e) => {
                var order = await Order.find({_id:e.order_id.toString(),order_location:"DELIVERED"})

                order.map((o) => {
                    array.push(o);
                })
            }))
            res.status(200).json({ message: `All user delivered orders goted`,"Delivered Order":array, "Total delivered order":array.length})
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



module.exports = { delivered_Order, getAllDelivered_Order}