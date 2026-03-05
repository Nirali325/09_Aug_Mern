import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name Is Required!"],
      minlength: 3,
    },
    lastName: {
      type: String,
      required: [true, "Last Name Is Required!"],
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      unique: true,
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: Number,
      // required: [true, "Phone Is Required!"],
      minlength: 10,
      maxlength: 10,
    },
    dob: {
      type: Date,
      // required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      // required: true,
      enum: ["Male", "Female"],
    },
    password: {
      type: String,
      // required: [true, "Password Is Required!"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      default: "Patient",
    },
    doctorDepartment: {
      type: String,
    },
    docAvatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

//
// 🔐 HASH PASSWORD
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//
// 🔐 COMPARE PASSWORD
//
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//
// 🔐 GENERATE JWT
//
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

export const User = mongoose.model("User", userSchema);