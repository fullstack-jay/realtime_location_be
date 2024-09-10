import { Response, Request } from "express";
import Respond from "../../utils/respond";
import Account from "../../database/models/account";
import { hashPwd, comparePwd, generateToken } from "../../utils/helpers";
//import OTPService from "../../services/otp";
//import { sendWhatsAppOTP } from "../../services/send_phone_number";

export default class UserController {
    static createAccount = async(req:Request, res: Response) => {
        const respond = new Respond(res);
        try {
            const password = await hashPwd(req.body.password);
            const account = await Account.create({ ...req.body, password});
            return respond.success(201, {
                message: "Account berhasil dibuat",
                data: account,
            })
        } catch (error: any){
            return respond.error(error);
        }
    }

    // static resendOTP = async (req: Request, res: Response) => {
    //     const respond = new Respond(res);
    //     try {
    //         const { phoneNumber } = req.body;
    //         const result = await OTPService.checkUserOTP(phoneNumber);

    //         if (!result) {
    //             await OTPService.generateOTP(phoneNumber);
    //             return respond.success(200, {
    //                 message: "OTP sukses dikirim",
    //                 data: undefined
    //             });
    //         }
    //         sendWhatsAppOTP(result.phoneNumber, result.otp);

    //         return respond.success(200, {
    //             message: "OTP sukses dikirim kembali",
    //             data: undefined
    //         })
    //     } catch(error) {
    //         return respond.error(error);
    //     }
    // }

//     static verifyPhoneNumber = async (req: Request, res: Response) => {
//     const respond = new Respond(res);
//     try {
//       const { phoneNumber, otp } = req.body;
//       const result = await OTPService.getOTP({ phoneNumber, otp });

//       if (!result) throw new Error("OTP not found");

//       const data = await Account.findOneAndUpdate(
//         { phoneNumber: result.phoneNumber, verified: false },
//         { verified: true },
//         { new: true }
//       );

//       if (!data) throw new Error("Account not found");

//       return respond.success(200, {
//         message: "Account verified successfully, create profile",
//         data,
//       });
//     } catch (error) {
//       return respond.error(error);
//     }
//   };

static login = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { phoneNumber, password } = req.body;

      const user = await Account.findOne({ phoneNumber });

      if (!user) {
        return respond.success(404, {
          message: "Account does not exist in our system",
          data: phoneNumber,
        });
      }

      const validPwd = await comparePwd(password, user.password);
      if (!validPwd) {
        return respond.success(401, {
          message: "Invalid password",
          data: phoneNumber,
        });
      }
      const token = generateToken(user.id);

      return respond.success(200, {
        message: "User logged in successfully",
        data: { user, token },
      });
    } catch (error) {
      return respond.error(error);
    }
  };
   
}