import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/paytm");

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30,  // Fixed typo from "macxLength" to "maxLength"
    },
});

// Define the account schema
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User model
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
});

// Create models
const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

// Export models using ES module syntax
export { User, Account };
