const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { Product, User, Order, Payment, Address } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");

// @desc Order Product
// @routs POST /api/user/order/order_Product
// @access pubilc
const orderProduct = asyncHandler(async (req, res) => {

    const { product, address_type, sender_account, sender_UPI, sender_CARD, payment_type,details} = req.body;

    if (address_type !== "HOME" && address_type !== "OFFICE" && address_type !== "SHOP" && address_type !== "OTHER") {
        const error = new Error("Address type should be HOME, OFFICE, SHOP or OTHER");
        error.status = 400;
        throw error;
    }

    if(payment_type !== "COD" && payment_type !== "UPI" && payment_type !== "CARD" && payment_type !== "ONLINE"){
        const error = new Error("Payment type should be COD, UPI, CARD or ONLINE");
        error.status = 400;
        throw error;
    }

    // console.log(payment_type);
    // console.log(sender_UPI,sender_CARD,sender_account);

    if(payment_type === "UPI" && !sender_UPI){
        const error = new Error("When you are using UPI sender_UPI is require");
        error.status = 400;
        throw error;
    }

    if(payment_type === "CARD" && !sender_CARD){
        const error = new Error("When you are using CARD sender_CARD is require");
        error.status = 400;
        throw error;
    }

    if(payment_type === "ONLINE" && !sender_account){
        const error = new Error("When you are using ONLINE sender_account is require");
        error.status = 400;
        throw error;
    }


    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const existProduct = await Product.findById(product.product_id);
        if (!existProduct) {
            const error = new Error("This Product not avilable");
            error.status = 404;
            throw error;
        }

        const address = await Address.findOne({ user_ID: req.user.id, address_type: address_type });
        // console.log(address);

        if (!address) {
            const error = new Error("This address not avilable");
            error.status = 404;
            throw error;
        }

        if (existProduct.quantity >= product.quantity) {

            let order_status = "CONTINUED";
            let order_location = "ORDERD";
            let totalPrice = 0;

            for (var i = 0; i < product.quantity; i++) {
                totalPrice = totalPrice + existProduct.price;
            }

            // const paymentForOrder await P.create()
            const orderProduct = await Order.create({
                order_status, order_location, address_type, payment_type, product, totalPrice,details, user_id:user
            });

            const getExistPayment = await Payment.findOne({ order_id: orderProduct._id });

            // console.log(orderProduct);
            if (payment_type === "COD") {

                const updatedProduct = await Product.findByIdAndUpdate(
                    product.product_id,
                    { quantity: existProduct.quantity - product.quantity },
                    { new: true, runValidators: true, }
                );

                // console.log(orderProduct);
                // console.log(updatedProduct);

                if (!orderProduct && !updatedProduct) {
                    const error = new Error("Product not ordered");
                    error.status = 404;
                    throw error;
                }

                res.status(200).json({ message: `Product order successfully`,"Payment type":"COD", orderProduct });


            } else if (payment_type === "UPI") {

                if (getExistPayment) {
                    res.status(200).json({ message: `Product order successfully`,description:'This Product order payment allready completed, Order successfully', orderProduct, getExistPayment });

                } else {
                    // write UPI payment logic hare

                    

                    const payment = await Payment.create({
                        payment: totalPrice,
                        sender_account: null,
                        sender_UPI: sender_UPI,
                        sender_CARD: null,
                        payment_type: payment_type,
                        order_id: orderProduct._id,
                        user_id: user
                    })

                    if (!payment) {

                        const ordersRemoved = await Order.findByIdAndDelete(orderProduct._id);

                        const error = new Error("Payment faild Product not ordered");
                        error.status = 403;
                        throw error;
                    }

                    const updatedProduct = await Product.findByIdAndUpdate(
                        product.product_id,
                        { quantity: existProduct.quantity - product.quantity },
                        { new: true, runValidators: true, }
                    );

                    // console.log(orderProduct);
                    // console.log(updatedProduct);

                    if (!orderProduct && !updatedProduct) {
                        const error = new Error("Product not ordered");
                        error.status = 404;
                        throw error;
                    }

                    res.status(200).json({ message: `Product order successfully`,"Payment type":"UPI", orderProduct, payment });
                }

            } else if (payment_type === "CARD") {

                if (getExistPayment) {
                    res.status(200).json({ message: `Product order successfully`,description:'This Product order payment allready completed, Order successfully', orderProduct, getExistPayment });

                } else {
                    // write CARD payment logic hare



                    const payment = await Payment.create({
                        payment: totalPrice,
                        sender_account: null,
                        sender_UPI: null,
                        sender_CARD: sender_CARD,
                        payment_type: payment_type,
                        order_id: orderProduct._id,
                        user_id: user
                    })

                    if (!payment) {

                        const ordersRemoved = await Order.findByIdAndDelete(orderProduct._id);

                        const error = new Error("Payment faild Product not ordered");
                        error.status = 403;
                        throw error;
                    }

                    const updatedProduct = await Product.findByIdAndUpdate(
                        product.product_id,
                        { quantity: existProduct.quantity - product.quantity },
                        { new: true, runValidators: true, }
                    );


                    if (!orderProduct && !updatedProduct) {
                        const error = new Error("Product not ordered");
                        error.status = 404;
                        throw error;
                    }

                    res.status(200).json({ message: `Product order successfully`,"Payment type":"CARD", orderProduct, payment });
                }

            } else if (payment_type === "ONLINE") {

                if (getExistPayment) {
                    res.status(200).json({ message: `Product order successfully`,description:'This Product order payment allready completed, Order successfully', orderProduct, getExistPayment });

                } else {
                    // write ONLINE payment logic hare


                    const payment = await Payment.create({
                        payment: totalPrice,
                        sender_account: sender_account,
                        sender_UPI: null,
                        sender_CARD: null,
                        payment_type: payment_type,
                        order_id: orderProduct._id,
                        user_id: user
                    })

                    if (!payment) {

                        const ordersRemoved = await Order.findByIdAndDelete(orderProduct._id);

                        const error = new Error("Payment faild Product not ordered");
                        error.status = 403;
                        throw error;
                    }

                    const updatedProduct = await Product.findByIdAndUpdate(
                        product.product_id,
                        { quantity: existProduct.quantity - product.quantity },
                        { new: true, runValidators: true, }
                    );

                    // console.log(orderProduct);
                    // console.log(updatedProduct);

                    if (!orderProduct && !updatedProduct) {
                        const error = new Error("Product not ordered");
                        error.status = 404;
                        throw error;
                    }


                    res.status(200).json({ message: `Product order successfully`,"Payment type":"ONLINE", orderProduct, payment });
                }

            }

        } else {
            res.status(201).json({ message: `Product is out of stock, you can order blow of quantity`, description: `This product is out of stock, your order quantity is more`, quantity: existProduct.quantity })
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




// @desc For cancell Order 
// @routs PUT /api/product/forCancellOrder/<order_id>
// @access pubilc
const forCancellOrder = asyncHandler(async (req, res) => {

    if (req.body.order_status === "CONTINUED") {
        const error = new Error("You cannot update the cancellation");
        error.status = 403;
        throw error;
    }

    try {

        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const order = await Order.findOne({ user_id: req.user.id, _id: req.params.order_id });
        // console.log(order);

        if (!order) {
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }
        if(order.order_location === "DELIVERED"){
            const error = new Error("Order is delivered");
            error.status = 403;
            throw error;
        }

        if(order.order_status === "CANCELLED"){
            const error = new Error("Order is cancelled allready");
            error.status = 403;
            throw error;
        }

        const cancelledOrder = await Order.findByIdAndUpdate(
            req.params.order_id,
            { order_status: req.body.order_status },
            { new: true, runValidators: true, }
        );

        if (!cancelledOrder) {
            const error = new Error("Order not cancelled");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "Order cancelled successfully", cancelledOrder });

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Order not found");
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





// @desc Get All Order of User
// @routs GET /api/user/order/getAllOrder_ofUser/
// @access pubilc
const getAllOrder_ofUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const orders = await Order.find({ user_id: req.user.id });
        // console.log(orders)
        let allOrders = [];

        await Promise.all(orders.map(async (o) => {

            const product = await Product.findById(o.product.product_id)

            const address = await Address.findOne({user_ID:user,address_type:o.address_type})

            const obj = {"id":o._id, "order_status":o.order_status, "order_location":o.order_location, "address_type":o.address_type, "payment_type":o.payment_type, "totalPrice": o.totalPrice,"order_completePercent":o.order_completePercent,"e_shippingDate":o.e_shippingDate, "e_deliveryDate":o.e_deliveryDate, "quantity":o.product.quantity, "details": o.details,"createdAt":o.createdAt, "updatedAt":o.updatedAt, "product": product == null ? "porduct not found" : product, "address": address == null ? "address not found" : address};
            // console.log(o)

            allOrders.push(obj);
        }))

        // console.log(allOrders)

        if (orders.length === 0) {
            const error = new Error("User has no Order");
            error.status = 404;
            throw error;
        } else {
            res.status(200).json({ message: `All user orders goted`, allOrders, "user name": user.username, "Total orders":orders.length})
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



module.exports = { orderProduct, getAllOrder_ofUser, forCancellOrder }