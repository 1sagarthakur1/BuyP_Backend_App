const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { Product, Category } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");

// @desc Add Product
// @routs POST /api/product/add_product
// @access pubilc
const addProduct = asyncHandler(async (req, res) => {

    const { product_name, images_array, brand, price, full_price, scheme, quantity, highlights, color, offer, ram_rom, size, weight, description, specifications, rating , product_category, sub_category, category_id } = req.body;

    try {
        const category = await Category.findById(category_id);
        if (!category) {
            const error = new Error("This Category not found, change category");
            error.status = 404;
            throw error;
        }

        const product = await Product.findOne({product_name});

        if (product) {
            const error = new Error("This Product is allready available");
            error.status = 403;
            throw error;
        }

        const addedProduct = await Product.create({
            product_name, images_array, brand, price, full_price, scheme, quantity, highlights, color, offer, ram_rom, size, weight, description, specifications, rating , product_category, sub_category, category_id
        });

        if (addedProduct) {
            res.status(200).json({ message: `Product add successfully`, addedProduct })
        }

    } catch (err) {

        // console.log(err.message);
        // console.log(err._message);
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("This Category not found, change category");
            error.status = 404;
            throw error;
        }
        else {
            if(err._message !== undefined){
                const error = new Error(err.message);
                error.status = 400;
                throw error;
            }else{
                const error = new Error(err.message);
                error.status = err.status;
                throw error;
            }
        }
    }
});



// @desc Update Product 
// @routs PUT /api/product/update_Product/<porduct id>
// @access pubilc
const update_product = asyncHandler(async (req, res) => {

    if("_id" in req.body){
        const error = new Error("You can not change id");
        error.status = 403;
        throw error;
    }

    // console.log(req.body.category_id)
    try {
        if("category_id" in req.body){
            const category = await Category.findById(req.body.category_id)
            if(!category){
                const error = new Error("This category not available, change category id");
                error.status = 404;
                throw error;
            }
        }    
    } catch (err) {
        const error = new Error("This category not available, change category id");
        error.status = 404;
        throw error;
    }
    
    try {

        const product = await Product.findById(req.params.Id);
        if(!product){
            const error = new Error("Porduct not found");
            error.status = 404;
            throw error;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.Id,
            req.body,
            { new: true, runValidators: true, }
        );
        res.status(200).json({ message: "Product updated successfully", updatedProduct });

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }
        else {
            // console.log(err._message)
            if(err._message !== undefined){
                const error = new Error(err.message);
                error.status = 400;
                throw error;
            }else{
                const error = new Error(err.message);
                error.status = err.status;
                throw error;
            }
        }
    }
});




// @desc Get product by name
// @routs GET /api/product/searchProduct_byName
// @access pubilc
const searchProduct_byName = asyncHandler(async (req, res) => {

    const query = req.query.q;

    // console.log(query);

    if (!query) {
        const error = new Error('Query parameter "q" is required');
        error.status = 404;
        throw error;
    }

    try {

        const products = await Product.find({
            $or: [
                { product_name: { $regex: query, $options: 'i' } }, // Case-insensitive search on the title field
                { brand: { $regex: query, $options: 'i' } }, // Case-insensitive search on the author field
                { product_category: { $regex: query, $options: 'i' } }, // Case-insensitive search on the author field
                { sub_category: { $regex: query, $options: 'i' } } // Case-insensitive search on the author field
            ]
        });

        if(products.length == 0){
            res.status(200).json({ message: "No any product with this query", products});
        }else{
            res.status(200).json({ message: "Get products", products,"Total Product":products.length});
        }

        

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        else {
            const error = new Error(err.message);
            error.status = err.status;
            throw error;
        }
    }
});



// @desc Get All Product
// @routs GET /api/product/getAll_Product
// @access pubilc
const getAllProduct = asyncHandler(async (req, res) => {

    try {
        const product = await Product.find();

        if(product.length == 0){
            const error = new Error("Product not found");
            error.status = 404;
            throw error;    
        }

        res.status(200).json({ message: "Products get successfully", product,"Total product":product.length});

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        else {
            const error = new Error(err.message);
            error.status = err.status;
            throw error;
        }
    }
});


// @desc get Product by id
// @routs GET /api/product/getProduct_byId/<id>
// @access pubilc
const getProduct_ById = asyncHandler(async (req, res) => {

    try {
        const product = await Product.findById(req.params.product_id);
        // console.log(product);
        

        if(!product){
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }

        // console.log(product.images_array);
        res.status(200).json({ message: "Product goted successfully",product});

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        else {
            const error = new Error(err.message);
            error.status = err.status;
            throw error;
        }
    }
});




// @desc Delete Product by Name
// @routs Delete /api/product/deletedProduct_ByName/<porudct name>
// @access pubilc
const deletedProduct_ByName = asyncHandler(async (req, res) => {

    try {
        const product = await Product.findOne({product_name:req.params.Name});
        // console.log(product);
        

        if(!product){
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }

        const deletedProduct = await Product.findByIdAndDelete(product._id);
        if(!deletedProduct){
            const error = new Error("Product not deleted");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "Product deleted successfully",deletedProduct});

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        else {
            const error = new Error(err.message);
            error.status = err.status;
            throw error;
        }
    }
});

module.exports = { addProduct, getAllProduct, update_product, searchProduct_byName, deletedProduct_ByName, getProduct_ById}