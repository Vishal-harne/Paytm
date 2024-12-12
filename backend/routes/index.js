import { Router } from "express";
import userRouter from "./user.js";
import accountRouter from "./account.js";

const router = Router();

// Set up the routes
router.use("/user", userRouter);
router.use("/account", accountRouter);

// Export the combined router
export default router;
