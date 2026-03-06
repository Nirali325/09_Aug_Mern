import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import cloudinary from "cloudinary";
import { dbConnection } from "./database/dbConnection.js";
import { User } from "./models/userSchema.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Connect Database
dbConnection();

// ✅ Create Default Admin Automatically
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (!existingAdmin) {
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        phone: "1234567890",
        dob: "2000-01-01",
        gender: "Male",
        password: "admin123",
        role: "Admin",
      });

      console.log("✅ Default Admin Created!");
    } else {
      console.log("✅ Admin Already Exists");
    }
  } catch (error) {
    console.log("Admin creation error:", error);
  }
};

createDefaultAdmin();

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});