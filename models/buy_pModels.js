const mongoose = require('mongoose');

// Define schema for Users
const validateAgeAboveTen = function (dateOfBirth) {
    const currentDate = new Date();
    const dob = new Date(dateOfBirth);
    const ageDiff = currentDate.getFullYear() - dob.getFullYear();

    if (ageDiff < 10) {
        return false;
    }
    return true; 
};


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: [3, 'User Name must be at least 3 characters'],
        maxlength: [20, 'User Name cannot exceed 20 characters'],
        required: [true, "Please add the user first name"]
    },
    image: {
        type: String,
        minlength: [3, 'Image link must be at least 3 characters'], // Set minimum length and custom error message
        maxlength: [200, 'Image link cannot exceed 20 characters'], // Set maximum length and custom error message
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: [
            { validator: validateAgeAboveTen, message: 'Age must be above 10.' }
        ]
    },
    gender: {
        type: String,
        enum: {
            values: ['MALE', 'FEMALE', 'OTHER'], // Define the allowed values
            message: 'Gender Must be either MALE, FEMALE, or OTHER.'
        },
        required: [true, "Please add the user gender"]
    },
    mobile: {
        type: Number,
        min: [1000000000, "Mobile number should be 10 digits"],
        max: [9999999999, "Mobile number should be 10 digits"],
        required: [true, "Please add the user mobile number"],
    },
    email: {
        type: String,
        unique: [true, "This email is allready ragisterd"],
        required: [true, "Please add the user email ID"]
    },
    hashedPassword: {
        type: String,
        required: [true, "Please add the user password"]
    },

}, { timestamps: true });





// Define schema for Address
const addressSchema = new mongoose.Schema({
    street_address: {
        type: String,
        minlength: [3, 'Street address must be at least 3 characters'], // Set minimum length and custom error message
        maxlength: [20, 'Street address cannot exceed 20 characters'], // Set maximum length and custom error message
        required: [true, "Street address is required"]
    },
    landmark: {
        type: String,
        minlength: [3, 'Landmark must be at least 3 characters'],
        maxlength: [20, 'Landmark cannot exceed 20 characters'],
    },
    building_no: {
        type: Number,
        min: [1, "Building number shuold be above 0"],
        max: [9999999, "Building number should be blow 8"]
    },
    city: {
        type: String,
        minlength: [3, 'City  must be at least 3 characters'],
        maxlength: [20, 'City  cannot exceed 20 characters'],
        required: [true, "City is required"]
    },
    district: {
        type: String,
        minlength: [3, 'District  must be at least 3 characters'],
        maxlength: [20, 'District  cannot exceed 20 characters'],
        required: [true, "District is required"]
    },
    state: {
        type: String,
        minlength: [3, 'State must be at least 3 characters'],
        maxlength: [20, 'State cannot exceed 20 characters'],
        required: [true, "state is required"]
    },
    pincode: {
        type: Number,
        min: [100000, "Pincode shuold be in 6 digit"],
        max: [999999, "Pincode should be in 6 digit"],
        required: [true, "Pincode is required"]
    },
    country: {
        type: String,
        minlength: [3, 'Country must be at least 3 characters'],
        maxlength: [20, 'Country cannot exceed 20 characters'],
        required: [true, "Country is required"]
    },
    address_type: {
        type: String,
        enum: {
            values: ['HOME', 'OFFICE', 'SHOP', 'OTHER'],
            message: 'Address type Must be either HOME, OFFICE, SHOP or OTHER.'
        },
        required: [true, "address type is required"]
    },
    address_description: {
        type: String,
        minlength: [0, 'Country must be at least 3 characters'],
        maxlength: [200, 'Country cannot exceed 20 characters'],
    },
    user_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "User id is required in address"] }
}, { timestamps: true });





// Define schema for Order
const orderSchema = new mongoose.Schema({
    order_status: {
        type: String,
        enum: {
            values: ['CANCELLED', 'CONTINUED'],
            message: 'Order status Must be either CANCELLED, CONTINUED'
        },
        required: [true, "Order status is required"]
    },
    order_location: {
        type: String,
        enum: {
            values: ['ORDERD', 'SHIPPING', 'DELIVERED'],
            message: 'Order location be either ORDERD, SHIPPING or DELIVERED'
        },
        required: [true, "Order status is required"]
    },
    address_type: {
        type: String,
        enum: {
            values: ['HOME', 'OFFICE', 'SHOP', 'OTHER'],
            message: 'Address type Must be either HOME, OFFICE, SHOP or OTHER.'
        },
        required: [true, "address type is required"]
    },
    payment_type: {
        type: String,
        enum: {
            values: ['UPI', 'CARD', "ONLINE", 'COD'], // Define the allowed values
            message: 'Payment type Must be either UPI, CARD, ONLINE or COD'
        },
    },
    totalPrice: {
        type: Number,
        required: [true, "Total Price is required in order"]
    },
    order_completePercent:{
        type:Number,
        default: 5,
        min: [0, "Order Complete Percent should be above 0 or equal 0"],
        max: [100, "Order Complete Percent should be blow 100 or equal 100"],
    },
    e_shippingDate:{
        type:Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
        required: [true, "E Shipping date is required"]
    },
    e_deliveryDate:{
        type:Date,
        default: () => Date.now() + (5 * 24 * 60 * 60 * 1000),
        required: [true, "E delivery date is required"]
    },
    details: {
        type: Object
    },
    product: {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, "Product id  is required in order"] },
        quantity: { type: Number, require: [true, "Product id  is required in order"] }
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: [true, "User id  is required in order"]
    }
}, { timestamps: true });




// Define schema for shipping
const shippingSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', required: [true, "order id is required in shipping"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: [true, "User id  is required in order"]
    }
}, { timestamps: true });




// Define schema for shipping
const deliverySchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', required: [true, "order id is required in delevery"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: [true, "User id  is required in order"]
    }
}, { timestamps: true });




// Define schema for Categories
const categorySchema = new mongoose.Schema({
    categoryt_image: {
        type: String,
        minlength: [3, 'Category image link must be at least 3 characters'],
        maxlength: [200, 'Category image link cannot exceed 200 characters'],
        required: [true, "Category image link is required"]
    },
    category_name: {
        type: String,
        minlength: [3, 'Category name must be at least 3 characters'],
        maxlength: [20, 'Category name cannot exceed 20 characters'],
        unique: [true, "This category is allready available"],
        required: [true, "Category name is required"]
    },
    description: {
        type: String,
        minlength: [3, 'Category description must be at least 3 characters'],
        maxlength: [200, 'Category description cannot exceed 200 characters'],
        required: [true, "Category description is required"]
    },
}, { timestamps: true });




// Define schema for Product
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        minlength: [2, 'Product name must be at least 2 characters'],
        maxlength: [100, 'Product name cannot exceed 25 characters'],
        unique: [true, "This product is allready available"],
        required: [true, "Please add the product name"]
    },
    images_array: {
        type: [String],
        validate: [
            {
                validator: function (arr) {
                    return arr.length >= 2;
                },
                message: 'Minimum 1 image should be present'
            },
            {
                validator: function (arr) {
                    return arr.length <= 20;
                },
                message: 'You can add only 6 images'
            }
        ],
        maxlength: [6, 'You can add only 6 image'],
        required: [true, "Please add the product image"]
    },
    brand: {
        brand_logo: {
            type: String,
        },
        brand_name: {
            type: String,
            required: [true, "Brand feild is require"]
        },
    },
    price: {
        type: Number,
        max: [9999999999, "Product price should be blow 999999999"],
        required: [true, "Please add the product price"],
    },
    full_price: {
        type: Number,
        max: [9999999999, "Product full price should be blow 999999999"],
        default:null
    },
    scheme: {
        type: Boolean,
        required: [true, "Please add the product scheme status true/false"],
    },
    quantity: {
        type: Number,
        max: [999999999, "Product price should be blow 999999999"],
        required: [true, "Please add the product quantity"],
    },
    highlights: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length >= 1;
            },
            message: 'Minimum 1 highlight should be present'
        },

        required: [true, "Please add the product highlight"],
    },
    color: {
        type: Object,
        default:null
    },
    offer: {
        type: Object,
        default:null
    },
    ram_rom: {
        ram: {
          type: String,
        },
        rom: {
          type: String,
        },
    }, 
    size: {
        type: String,
        default:null
    },
    weight: {
        type: String,
        default:null
    },
    description: {
        main_description: {
            type: String,
            required: [true, "Add main description"],
            minlength: [100, 'Main description must be at least 200 characters'],
        },
        product_descriptions_Image: {
            type: Object,
            default: null,
        }
    },
    specifications: {
        type: Object,
        default: null,
    },
    rating: {
        type: Number,
        min: [1, 'You need to give rating atleast 1'],
        max: [5, 'You can give mix 5 rating'],
        required: [true, "Please add the product rating"],
    },
    product_category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        minlength: [2, 'Product sub category must be at least 3 characters'],
        maxlength: [20, 'Product sub category cannot exceed 20 characters'],
        default:null
    },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, "Category id is required in Product"] },
}, { timestamps: true });

// Define schema for Cart
const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: [true, "User id is required in Cart"]
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Product',
        required: [true, "Product id is required in Cart"]
    }
},{ timestamps: true });

// Define schema for Payment
const paymentSchema = new mongoose.Schema({
    payment: {
        type: Number,
        required: [true, "Please add the Order payment"],
    },
    sender_account: {
        type: Number,
        max: [999999999999999, "Account should be in 15 digit"],
    },
    sender_UPI: {
        type: String,
        minlength: [2, 'sender_UPI must be at least 3 characters'],
        maxlength: [20, 'sender_UPI cannot exceed 20 characters'],
    },
    sender_CARD: {
        type: String,
        minlength: [2, 'semder_CARD must be at least 3 characters'],
        maxlength: [20, 'semder_CARD cannot exceed 20 characters'],
    },
    payment_type: {
        type: String,
        enum: {
            values: ['UPI', 'CARD', "ONLINE", 'COD'], // Define the allowed values
            message: 'Payment type Must be either UPI, CARD, ONLINE or COD'
        },
    },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: [true, "order_id id is required in payment"] },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "user_id id is required in payment"] }
},{ timestamps: true });


// Define schema for Cart
const reviewsSchema = new mongoose.Schema({
    image: {
        type: [],
        validate: {
            validator: function (v) {
                // Customize the condition as per your requirement
                return v.length <= 4; // For example, maximum length is 10
            },
            message: `you can upload only 4 image`
        }
    },
    description: {
        type: String,
        minlength: [10, 'Review description must be at least 3 characters'],
        maxlength: [300, 'Review description cannot exceed 200 characters'],
        required: [true, "Please add the Review description"]
    },
    rating: {
        type: Number,
        min: [1, 'You need to give rating atleast 1'],
        max: [5, 'You can give mix 5 rating'],
        required: [true, "Please add the product rating"],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: [true, "User id is required in Review"]
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Product',
        required: [true, "Product id is required in Review"]
    }
},{ timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Address = mongoose.model('Address', addressSchema);
const Order = mongoose.model('Order', orderSchema);
const Shipping = mongoose.model('Shipping', shippingSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Review = mongoose.model('Review', reviewsSchema);

module.exports = { User, Address, Category, Product, Order, Shipping, Payment, Delivery, Cart, Review };
