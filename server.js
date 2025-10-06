import express from "express"
import cors from "cors" 
import dotenv from "dotenv"
import mongoose from "mongoose"
import  errorHandler  from "./middleware/errorhandler.js"
import signatureRouter from "./routes/SignatureRoutes.js"
import clerkWebhook from './routes/clerkWebhook.js'
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
dotenv.config()
const connectDB = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.VITE_MONGODB_URI)
        console.log("Server connected to MongoDB  successfully");
        return connection;
    }catch(err){
        console.error('Error',err.message)
        process.exit(1)
    }
}
connectDB()

const app = express()
const PORT = process.env.PORT || 8000 

//so that backend is able to talk to the frontend

const allowedOrigins = ['http://localhost:3000','https://email-signature-generator-backend.onrender.com']
app.use(cors({
    origin: allowedOrigins, 
    credentials: true, 
  }))
app.use(express.json())
app.use("/api/signature", ClerkExpressRequireAuth(), signatureRouter);
app.use("/api/webhooks", express.raw({ type: "application/json" }), clerkWebhook);

app.use(errorHandler)
app.listen(PORT,()=>{
    console.log('Server Running on port: ',PORT)

})






