const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { User } = require("../models/buy_pModels.js");
const { default: mongoose } = require("mongoose");
const isemail = require('isemail');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')


const uesrStor = {};
const otpStorage = {};
const userEmail = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '1sagarthakur1@gmail.com',
        pass: 'axtq dnnb yoaa jeuk'
    }
});

// @desc Sand OTP for ragister User
// @routs POST /api/user/sendOtp
// @access pubilc
const sendOtpforRagisterUser = asyncHandler(async (req, res) => {

    // console.log(req.body);
    const { username, image, dateOfBirth, gender, mobile, email, password } = req.body;

    function isValidEmail(email) {
        if (!isemail.validate(email)) {
            return false;
        }
        return true;
    }

    const fsdf = isValidEmail(email);

    if (fsdf) {

        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            const error = new Error("User already ragistered");
            error.status = 400;
            throw error;
        }

        // // Hash Password
        const hashedPassword = await bycrypt.hash(password, 10);

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        uesrStor[email] = { username, image, dateOfBirth, gender, mobile, email, hashedPassword };
        otpStorage[email] = otp;

        const mailOptions = {
            from: '1sagarthakur1@gmail.com',
            to: email,
            subject: 'OTP for registration',
            text: `Wellcome BuyP \n Your OTP for registration is: ${otp}`
        };

        try {

            await transporter.sendMail(mailOptions);

            res.json({ message: 'OTP sent successfully' });

        } catch (err) {
            console.error('Error sending email:', error);
            const error = new Error("Failed to send OTP via email");
            error.status = 500;
            throw error;
        }

    } else {
        const error = new Error("email not vaild");
        error.status = 404;
        throw error;
    }

});




// @desc Ragister User by otp
// @routs POST /api/user/userRagisterByOtp
// @access pubilc
const ragisterdUserbyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        const error = new Error("some thing is missing");
        error.status = 404;
        throw error;
    }

    console.log(email, otp)

    if (otpStorage[email] && otpStorage[email] === otp) {

        const user = uesrStor[email];
        console.log(user);
        try {
            const userCreated = await User.create(user);

            delete uesrStor[email];
            delete otpStorage[email];

            if (userCreated) {
                res.status(200).json({ message: "User ragister successfully", name: user.username, email: user.email })
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

    } else {
        res.json({ message: 'Invalid OTP' }).status(404);
    }
})




// @desc update User
// @routs PUT /api/user/update_user
// @access pubilc
const updateUser = asyncHandler(async (req, res) => {
    // console.log(req.user.id)

    if ("_id" in req.body) {
        const error = new Error("You can not change id");
        error.status = 403;
        throw error;
    } else if ("email" in req.body) {
        const error = new Error("You can not change email");
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

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true, runValidators: true, }
        );
        res.status(200).json({ message: "user updated successfully", updatedUser });

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



// @desc get User by id
// @routs GET /api/user/getUser_id
// @access pubilc
const getUserBy_Id = asyncHandler(async (req, res) => {

    try {
        const user = await User.findById(req.params.Id);
        // console.log(user);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "user get successfully", user });

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



// @desc get User by id
// @routs GET /api/user/getAllUsers
// @access pubilc
const getAllUsers = asyncHandler(async (req, res) => {

    try {
        const users = await User.find();

        if (users.length == 0) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "users get successfully", users });

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



// @desc Delete User by id
// @routs Delete /api/user/deleteUserBy_Id
// @access pubilc
const deleteUserBy_Id = asyncHandler(async (req, res) => {

    try {

        const user = await User.findById(req.params.Id);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const deletedUser = await User.findByIdAndDelete(req.params.Id);
        if (!deletedUser) {
            const error = new Error("User not deleted");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "user delete successfully", deletedUser });

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


// @desc Login User
// @routs GET /api/user/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error("All fields are mandatroy");
        error.status = 400;
        throw error;
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bycrypt.compare(password, user.hashedPassword))) {
            const accessToken = jwt.sign({
                user: {
                    id: user._id,
                    username: user.username,
                    imagea: user.image,
                    dateOfBirth: user.dateOfBirth,
                    gender: user.gender,
                    mobile: user.mobile,
                    email: user.email
                }
            }, process.env.ACCESS_TOKEN_SECERT, { expiresIn: "24h" })

            // const expires = new Date();
            // expires.setDate(expires.getSeconds() + 10);

            const cookieOptions = {
                // httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                sameSite: 'None'
            };

            res.cookie("token", accessToken, cookieOptions).json({ message: "Login successfully" }).status(200);

            // res.json({ message: "gettoken", accessToken }).status(200);

        } else {
            const error = new Error("email or password is not valid");
            error.status = 404;
            throw error;
        }


    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("email or password is not valid");
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
})


// @desc LogOut User
// @routs GET /api/user/logOut
// @access public
const logOutUser = asyncHandler(async (req, res) => {

    try {

        res.clearCookie("token").json({ message: "logout successfully" }).status(200);
        // res.clearCookie('token').json({})

    } catch (err) {
        if (err instanceof mongoose.CastError && err.path === '_id') {
            const error = new Error("email or password is not valid");
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
})




// @desc Current User infor
// @routs POST /api/user/current
// @access private
const currentUserinfo = asyncHandler(async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "Current user", user });

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





// @desc Sand OTP for Reset Password
// @routs POST /api/user/otp_ForResetpassword
// @access pubilc
const sendOtpforResetPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    function isValidEmail(email) {
        if (!isemail.validate(email)) {
            return false;
        }
        return true;
    }

    const fsdf = isValidEmail(email);

    if (fsdf) {

        const userAvailable = await User.findOne({ email });
        if (!userAvailable) {
            const error = new Error("User not exist");
            error.status = 400;
            throw error;
        }


        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        userEmail[email] = email;
        otpStorage[email] = otp;

        // console.log(otp);

        try {

            const mailOptions = {
                from: 'samikshathakur764@gmail.com',
                to: email,
                subject: 'OTP for reset password',
                text: `Wellcome BuyP \n Your OTP for reset password is: ${otp}`
            };

            await transporter.sendMail(mailOptions);

            res.json({ message: 'OTP send successfully' });

        } catch (err) {
            console.error('Error sending email:', error);
            const error = new Error("Failed to send OTP via email");
            error.status = 500;
            throw error;
        }

    } else {
        const error = new Error("email not vaild");
        error.status = 404;
        throw error;
    }

});



// @desc reset password by otp
// @routs POST /api/user/reset_PasswordByOtp
// @access pubilc
const resetPasswordByOtp = asyncHandler(async (req, res) => {

    const { email, password, otp } = req.body;

    if (otpStorage[email] && otpStorage[email] === otp) {

        try {
            const user = await User.findOne({ email: email })
            if (!user) {
                const error = new Error("User not found");
                error.status = 404;
                throw error;
            }

            const hashedPassword = await bycrypt.hash(password, 10);

            const updatedPasswordUser = await User.findByIdAndUpdate(
                user._id,
                {hashedPassword:hashedPassword},
                { new: true, runValidators: true, }
            );

            delete uesrStor[email];
            delete otpStorage[email];

            if (updatedPasswordUser) {
                res.status(200).json({ message: "User password update successfully" })
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

    } else {
        res.json({ message: 'Invalid OTP' }).status(404);
    }
})




module.exports = { sendOtpforRagisterUser, ragisterdUserbyOtp, updateUser, getUserBy_Id, getAllUsers, deleteUserBy_Id, loginUser, currentUserinfo, logOutUser, sendOtpforResetPassword, resetPasswordByOtp }