const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { User, Category } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");


// @desc Add category
// @routs POST /api/category/add_cotegory
// @access pubilc
const add_category = asyncHandler(async (req, res) => {

    const {categoryt_image, category_name, description,} = req.body;
    
    try {
        const userAvailable = await Category.findOne({ category_name });
        
        if (userAvailable) {
            const error = new Error("This category already exist");
            error.status = 403;
            throw error;
        }
    
        const category = await Category.create({
            categoryt_image,category_name,description
            // { new: true, runValidators: true, }
        });
    
        if(category){

            res.status(200).json({ message: "category added successfully", category})

        }else{
            const error = new Error("category not added");
            error.status = 403;
            throw error;
        }
    } catch (err) {
        // console.log(err._message.split(/\s+/).slice(-2).join(" "));
        // console.log(err._message.split(/\s+/).slice(-2).join(" ") == "validation failed");
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Category not found");
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



// @desc get All Category
// @routs GET /api/category/getAll_Category
// @access pubilc
const getAllCategory = asyncHandler(async (req, res) => {

    try {
        const category = await Category.find();

        if(category.length == 0){
            const error = new Error("Category not found");
            error.status = 404;
            throw error;    
        }

        res.status(200).json({ message: "Category get successfully", category });

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("Category not found");
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

// @desc get User by id
// @routs GET /api/user/getUser_id
// @access pubilc
// const getUserBy_Id = asyncHandler(async (req, res) => {

//     try {
//         const user = await User.findById(req.params.Id);
//         // console.log(user);
//         if(!user){
//             const error = new Error("User not found");
//             error.status = 404;
//             throw error;
//         }

//         res.status(200).json({ message: "user get successfully", user});

//     } catch (err) {
//         if (err instanceof mongoose.CastError && err.path === '_id') {
//             const error = new Error("User not found");
//             error.status = 404;
//             throw error;
//         }
//         else {
//             const error = new Error(err.message);
//             error.status = err.status;
//             throw error;
//         }
//     }
// });





// @desc Delete User by id
// @routs Delete /api/user/deleteUserBy_Id
// @access pubilc
// const deleteUserBy_Id = asyncHandler(async (req, res) => {
    
//     try {
        
//         const user = await User.findById(req.params.Id);

//         if(!user){
//             const error = new Error("User not found");
//             error.status = 404;
//             throw error;
//         }

//         const deletedUser = await User.findByIdAndDelete(req.params.Id);
//         if(!deletedUser){
//             const error = new Error("User not deleted");
//             error.status = 404;
//             throw error;
//         }

//         res.status(200).json({ message: "user delete successfully", deletedUser});

//     } catch (err) {
//         if (err instanceof mongoose.CastError && err.path === '_id') {
//             const error = new Error("User not found");
//             error.status = 404;
//             throw error;
//         }
//         else {
//             const error = new Error(err.message);
//             error.status = err.status;
//             throw error;
//         }
//     }
// });

module.exports = { add_category, getAllCategory}