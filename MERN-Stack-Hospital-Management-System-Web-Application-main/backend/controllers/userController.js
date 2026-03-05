// backend/controllers/userController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { OAuth2Client } from "google-auth-library";

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =========================
   Google Login / Register
========================= */
export const googleLogin = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new ErrorHandler("Token is required", 400));

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      password: "googleLogin", // temporary, won't be used
      role: "Patient",
    });
  }

  generateToken(user, "Google Login Successful!", 200, res);
});

/* =========================
   Patient Registration
========================= */
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ErrorHandler("User already registered!", 400));

  const user = await User.create({
    firstName, lastName, email, phone, nic, dob, gender, password, role: "Patient"
  });

  generateToken(user, "User Registered!", 200, res);
});

/* =========================
   Login
========================= */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return next(new ErrorHandler("Please fill the full form!", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email or Password!", 400));

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) return next(new ErrorHandler("Invalid Email or Password!", 400));

  if (role !== user.role) return next(new ErrorHandler("User not found with this role!", 400));

  generateToken(user, "Login Successfully!", 200, res);
});

/* =========================
   Admin / Doctor Management
========================= */
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) return next(new ErrorHandler("Admin with this email already exists!", 400));

  const admin = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role: "Admin" });

  res.status(200).json({ success: true, message: "New Admin Registered", admin });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.docAvatar) return next(new ErrorHandler("Doctor avatar required!", 400));

  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) return next(new ErrorHandler("File format not supported!", 400));

  const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const existingDoctor = await User.findOne({ email });
  if (existingDoctor) return next(new ErrorHandler("Doctor with this email already exists!", 400));

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) return next(new ErrorHandler("Failed to upload avatar", 500));

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: { public_id: cloudinaryResponse.public_id, url: cloudinaryResponse.secure_url }
  });

  res.status(200).json({ success: true, message: "New Doctor Registered", doctor });
});

/* =========================
   Fetch / Logout
========================= */
export const getAllDoctors = catchAsyncErrors(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({ success: true, doctors });
});

export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

export const logoutAdmin = catchAsyncErrors(async (req, res) => {
  res.status(200).cookie("adminToken", "", { httpOnly: true, expires: new Date(0) }).json({
    success: true,
    message: "Admin logged out successfully."
  });
});

export const logoutPatient = catchAsyncErrors(async (req, res) => {
  res.status(200).cookie("patientToken", "", { httpOnly: true, expires: new Date(0) }).json({
    success: true,
    message: "Patient logged out successfully."
  });
});