import express from "express";
import {
  login,
  patientRegister,
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient
} from "../controllers/userController.js"; // single, clean import

import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", addNewAdmin);
router.get("/doctors", getAllDoctors);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router;