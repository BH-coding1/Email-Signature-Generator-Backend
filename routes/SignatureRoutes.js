import express from "express";
import signatureSchema from "../Models/SignatureSchema.js";

const router = express.Router();

// getting the signatures
// api/signatures
// get
router.post("/", async (req, res, next) => {
  
  try {
    // we spread the req.body so that every bit of data we send goes to its correct place
    const newsignature = await signatureSchema.create({
      ...req.body,
      user: req.auth.userId,
    });
    if (!newsignature) {
      return res.status(404).json({ message: "Failed to create" });
    }
    console.log("Saved:", newsignature);
    res.status(200).json(newsignature);
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// getting the signatures
// api/signatures
// get
router.get("/", async (req, res, next) => {
  try {
    const signatures =
      (await signatureSchema.find({ user: req.auth.userId })) || {};
    if (!signatures) {
      return res.status(404).json({ message: "No signatures found" });
    }
    console.log('Returning: ',signatures)
    res.status(200).json(signatures);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// getting one signature by id
// api/signatures
// get /:id
router.get("/:id", async (req, res, next) => {
  try {
    const signatures =
      (await signatureSchema.findOne({
        _id: req.params.id,
        user: req.auth.userId,
      })) || {};
    if (!signatures) {
      return res.status(404).json({ message: "No signatures found" });
    }
    res.status(200).json(signatures);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
// getting one signature by id and updating it
// api/signatures
// put  /edit/:id
router.put("/edit/:id", async (req, res, next) => {
  try {
    // we also have to spread the data so it goes to the correct schemas
    const updatedSignature = await signatureSchema.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.userId },
      { ...req.body },
      { new: true },
      
    );
    if (!updatedSignature) {
      return res.status(404).json({ message: "Failed to edit signature" });
    }
    
    res.status(200).json(updatedSignature);
    console.log('signature updated',updatedSignature)
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// deleting one signature by id
// api/signatures
// delete /:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedSignature = await signatureSchema.findOneAndDelete({
      _id: req.params.id,
      user: req.auth.userId,
    });
    if (!deletedSignature) {
      return res.status(404).json({ message: "Failed to delete signature" });
    }
    console.log('deleting',deletedSignature)
    res.status(200).json({ message: "Signature deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
