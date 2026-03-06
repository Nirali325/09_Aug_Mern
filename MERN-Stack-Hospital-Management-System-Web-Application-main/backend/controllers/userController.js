// backend/controllers/userController.js

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

/* =========================
   Helper: Generate JWT + Set Cookie
========================= */
const sendToken = (user, message, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  const cookieName =
    user.role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      httpOnly: true,
      secure: false,   // IMPORTANT for localhost
      sameSite: "lax",
    })
    .json({
      success: true,
      message,
      user,
    });
};

/* =========================
   Patient Registration
========================= */
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Patient",
  });

  sendToken(user, "User Registered Successfully!", 200, res);
});

/* =========================
   Login (Admin + Patient)
========================= */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1️⃣ Check fields
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password!", 400));
  }

  // 2️⃣ Find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }

  // 3️⃣ Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }

  // 4️⃣ Send token (role auto handled)
  sendToken(user, "Login Successfully!", 200, res);
});

/* =========================
   Add New Admin
========================= */
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    return next(new ErrorHandler("Admin already exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

/* =========================
   Add New Doctor
========================= */
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.docAvatar) {
    return next(new ErrorHandler("Doctor avatar required!", 400));
  }

  const { docAvatar } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File format not supported!", 400));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const existingDoctor = await User.findOne({ email });
  if (existingDoctor) {
    return next(new ErrorHandler("Doctor already exists!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

/* =========================
   Get All Doctors
========================= */
export const getAllDoctors = catchAsyncErrors(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });

  res.status(200).json({
    success: true,
    doctors,
  });
});

/* =========================
   Get Logged In User
========================= */
export const getUserDetails = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/* =========================
   Logout
========================= */
export const logoutAdmin = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Admin logged out successfully.",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Patient logged out successfully.",
    });
});