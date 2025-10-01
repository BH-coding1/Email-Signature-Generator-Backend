import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String },
    JobTitle: { type: String },
    CompanyName: { type: String },
    PhoneNumber: { type: String },
    EmailAddress: { type: String, required: true },
    Website: { type: String },
    Address: { type: String },
  },
  { _id: false }
);

const styleSchema = new mongoose.Schema(
  {
    fontFamily: { type: String, default: "Arial" },
    fontSize: { type: Number, default: 14 },
    textColor: { type: String, default: "#000000" },
    linkColor: { type: String, default: "#1a73e8" },
    boldName: { type: Boolean, default: true },
    italicJob: { type: Boolean, default: false },
    themeColor: { type: String, default: "#1a73e8" },
    borderStyle: {
      type: String,
      enum: ["none", "solid", "dashed", "dotted"],
      default: "none",
    },
    borderColor: { type: String, default: "#000000" },
    borderRadius: { type: Number, default: 2 },
    showSocialIcons: { type: Boolean, default: true },
    alignment: { type: String, enum: ["left", "center", "right"], default: "left" },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    LogoUrl: { type: String },
    ProfilePictureUrl: { type: String },
    SignatureUrl: { type: String },
  },
  { _id: false }
);

const signatureSchema = new mongoose.Schema(
  {
    user:String,

    company: companySchema,
    style: styleSchema,
    images: imageSchema,

    selectedTemplate: {
      type: String,
      enum: ["classic", "minimal", "coperate", "compact"],
      default: "classic",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Signature", signatureSchema);
