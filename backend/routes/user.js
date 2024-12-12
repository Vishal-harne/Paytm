import express from "express";
import { User, Account } from "../db.js";  // Importing User and Account models
import { z } from "zod";  // Import zod for validation
import { authmiddleware } from "../middleware.js";  // Import auth middleware
import jwt from "jsonwebtoken";  // Import jsonwebtoken for JWT handling
import JWT_SECRET from "../config.js";  // Import JWT_SECRET

const router = express.Router();

// Define the Zod validation schema for signup
const signupBody = z.object({
    username: z.string().email(),
    password: z.string(),
    FirstName: z.string(),
    LastName: z.string(),
});

// Sign up route
router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.json({
            message: "Email already exists or incorrect input"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.json({
            message: "Email already existed"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.FirstName,
        lastname: req.body.LastName,
    });

    const userId = user._id;
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token,
    });
});

// Define the Zod validation schema for signin
const signinBody = z.object({
    username: z.string().email(),
    password: z.string()
});

// Sign in route
router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken/Incorrect"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);

        return res.json({
            token: token
        });
    }

    res.status(411).json({
        message: "Error while logging in"
    });
});

// Define the Zod validation schema for updating user data
const updateBody = z.object({
    password: z.string().optional(),
    FirstName: z.string().optional(),
    LastName: z.string().optional(),
});

// Update user data route
router.put('/', authmiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne(
        { _id: req.userId }, 
        { $set: req.body }  // Corrected: Set the update body fields
    );

    res.json({
        message: "Updated successfully"
    });
});

// Bulk get users with filter
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || " ";
    const users = await User.find({
        $or: [
            { FirstName: { "$regex": filter, "$options": "i" } },
            { LastName: { "$regex": filter, "$options": "i" } }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            FirstName: user.FirstName,
            LastName: user.LastName,
            _id: user._id,
        }))
    });
});

export default router;
