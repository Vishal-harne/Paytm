import express, { json } from "express";
const app=express();
import cors from "cors";
app.use(cors());
app.use(json());
import mainRouter from "./routes/index.js";

app.use("/api/v1",mainRouter);
app.listen((3000),()=>{
    console.log("server stated runnning");
});
