import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  const cookieName =
    user.role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      // expires: new Date(
      //   Date.now() +
      //     process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      // ),
    })
    .json({
      success: true,
      message,
      user,
    });
};