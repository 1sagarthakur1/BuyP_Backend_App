const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const { User, Address } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");



// @desc Ragister User
// @routs POST /api/user/address/add_user
// @access pubilc
const addAddress_forUser = asyncHandler(async (req, res) => {

    const { street_address, landmark, building_no, city, district, state, pincode, country, address_type, address_description} = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const Alladdress = await Address.find({ user_ID: req.user.id });
        // console.log(Alladdress.length);

        if (Alladdress.length === 0) {
            const address = await Address.create({
                street_address, landmark, building_no, city, district, state, pincode, country, address_type, address_description, user_ID:req.user.id
            });
            if (address) {
                res.status(200).json({ message: `address add successfully`,"User Name":`${user.username}`, UserAddress: address })
            }
        }
        else if (Alladdress.length > 0 && Alladdress.length < 4) {
            let count = 0;
            Alladdress.map((e) => {
                if (e.address_type === address_type) {
                    count++;
                }
            })
            if (count == 0) {
                const address2 = await Address.create({
                    street_address, landmark, building_no, city, district, state, pincode, country, address_type, address_description, user_ID:req.user.id
                });
                if (address2) {
                    res.status(200).json({ message: `address add successfully`,"User Name":`${user.username}`, UserAddress: address2 })
                }
            } else {
                const error = new Error("This type address allready exist, change type");
                error.status = 403;
                throw error;
            }
        } else {
            const error = new Error("You can add only 4 addresss");
            error.status = 403;
            throw error;
        }

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
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




// @desc Update User Address
// @routs PUT /api/user/address/updateUser_Address/<address_type>
// @access pubilc
const updateUser_Address = asyncHandler(async (req, res) => {

    const { street_address, landmark, building_no, city, district, state, pincode, country, address_description } = req.body;

    if (req.params.Type !== "HOME" && req.params.Type !== "OFFICE" && req.params.Type !== "SHOP" && req.params.Type !== "OTHER") {
        const error = new Error("Address type should be HOME, OFFICE, SHOP or OTHER");
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
        const Alladdress = await Address.find({user_ID:req.user.id});
        // console.log(Alladdress)
   
        if (Alladdress.length === 0) {
            const error = new Error("User has no address");
            error.status = 404;
            throw error;

        } else {

            let count = 0;
            let getAddress = {};
            Alladdress.map(async (e) => {
                if (e.address_type === req.params.Type) {
                    count++;
                    getAddress = e;
                }
            })


            if (count > 0) {
                const updatedUserAddress = await Address.findByIdAndUpdate(
                    getAddress.id,
                    req.body,
                    { new: true, runValidators: true, }
                );
                // console.log(updatedUserAddress)
                res.status(200).json({ message: `address updataed successfully`,"User Name":`${user.username}`, updatedUserAddress})
            } else {
                const error = new Error("User has no This type address");
                error.status = 404;
                throw error;
            }
        }

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
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




// @desc Get All User Address
// @routs GET /api/user/address/getAll_UserAddress
// @access pubilc
const getAll_UserAddress = asyncHandler(async (req, res) => {
    // console.log(req.user.id);
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const Alladdress = await Address.find({ user_ID:req.user.id});

        if (Alladdress.length === 0) {

            const error = new Error("User has no address");
            error.status = 404;
            throw error;

        } else {
            res.status(200).json({ message: `All address goted`,"User Name":`${user.username}`, Alladdress,"Total address":Alladdress.length})
        }

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
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



// @desc Delete User Address
// @routs Delete /api/user/address/delete_UserAddess/<Type>
// @access pubilc
const delete_UserAddress = asyncHandler(async (req, res) => {
    // console.log(street_address,req.params.Id,req.params.Type);
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const Alladdress = await Address.find({ user_ID: req.user.id });

        if (Alladdress.length === 0) {
            const error = new Error("User has no address");
            error.status = 404;
            throw error;

        } else {

            let count = 0;
            let getAddress = {};
            Alladdress.map(async (e) => {
                if (e.address_type === req.params.Type) {
                    count++;
                    getAddress = e;
                }
            })

            if (count > 0) {
                const deletedAddress = await Address.findByIdAndDelete(getAddress.id);
                // console.log(getAddress.id);

                if(!deletedAddress){
                    const error = new Error("User not deleted");
                    error.status = 404;
                    throw error;
                }
                res.status(200).json({ message: `address deleted successfully`,"User Name":`${user.username}`,deletedAddress})
                
            } else {
                const error = new Error("User has no This type address");
                error.status = 404;
                throw error;
            }

        }

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
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


// @desc Get All User Address
// @routs GET /api/user/address/get_UserAddress_byType
// @access pubilc
const get_UserAddress_byType = asyncHandler(async (req, res) => {
    // console.log(req.user.id);
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const address = await Address.findOne({ user_ID:req.user.id,address_type:req.params.AddressType});

        if (!address) {
            const error = new Error("address not found");
            error.status = 404;
            throw error;

        } else {
            res.status(200).json({ message: `address goted`,"User Name":`${user.username}`, address})
        }

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("User not found");
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

module.exports = { addAddress_forUser, updateUser_Address, getAll_UserAddress, delete_UserAddress, get_UserAddress_byType}