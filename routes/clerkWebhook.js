import express from "express";
import User from "../Models/User.js";
import { Webhook } from "svix";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Clerk sends JSON, make sure express.json() is enabled in server.js
router.post("/clerk", async (req, res) => {


  const body = req.body
  const headers = req.headers;

  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  const WEBHOOK_SECRET = process.env.VITE_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("ADD WEBHOOK SECRET IN ENV ");
  }
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing Svix headers" });
  }



  const wh = new Webhook(WEBHOOK_SECRET);

  let event;
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  console.log("Verified Clerk event:", event.type);

  try {
    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = event.data;
        console.log('Data recieved: ',id,email_addresses,first_name,last_name)
      await User.create({
        clerkUserId: id,
        email: email_addresses?.[0]?.email_address || `${id}@noemail.clerk`,
        firstName: first_name || "",
        
        lastName: last_name || "",
      });

      console.log("✅ User created and saved to DB");
    }

    if (event.type === "user.deleted") {
      await User.findOneAndDelete({ clerkUserId: event.data.id });
      console.log("🗑️ User deleted from DB");
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
