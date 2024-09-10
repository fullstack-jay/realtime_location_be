import express from "express";
import UserController from "../controllers/account";
import AuthValidate from "../../utils/validations/_user_validate";

const accountRoutes = express.Router();

accountRoutes.post(
    "/create",
    UserController.createAccount,
)  

// accountRoutes.post(
//     "/verify-account",
//     AuthValidate.otp,
//     UserController.verifyPhoneNumber
// )

accountRoutes.post(
    "/login", 
    AuthValidate.login, 
    UserController.login
);

// accountRoutes.post(
//     "/resend-otp", 
//     AuthValidate.phoneNumber, 
//     UserController.resendOTP
// );

export default accountRoutes