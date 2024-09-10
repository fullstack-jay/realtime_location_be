import { JobAttributesData } from "agenda";
import otpGenerator from "otp-generator";
import { agenda } from "../database/config";
import TempOTP from "../database/models/temp_otp";

interface DeleteOTP extends JobAttributesData {
   id: string; 
}

const DELETE_OTP = "DELETE_OTP";
export default class OTPService {
    // Menghasilkan kode OTP
    static generateOTP = async (phoneNumber: string) => {
        try {
            const uniqueNumber = otpGenerator.generate(4, {
                digits: true,
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });

            await TempOTP.create({
            phoneNumber: phoneNumber,
            otp: Number(uniqueNumber),
      });
      console.log("Nomor OTP:", uniqueNumber)
      return uniqueNumber;
        } catch(error: any) {
            console.log(error.message);
        }
    };

    // Hapus kode OTP setelah 2 jam
    static deleteOTP = async (id: string) => {
        try {
            await agenda.start();
            agenda.define<DeleteOTP>(DELETE_OTP, async (job, done) => {
                try {
                    await TempOTP.findByIdAndDelete(job.attrs.data.id);  
                    await job.remove();
                } catch (error:any) {
                    console.log(error.message);
                }
                done();
            });
            await agenda.schedule<DeleteOTP>("Dalam 2 jam", DELETE_OTP, { id });
        } catch (error) {
            console.log("Ada yang tidak beres", error);
        }
    };

    static getOTP = async (otp: { phoneNumber:string; otp: number}) => {
        return await TempOTP.findOne(otp);
    };

    static checkUserOTP = async (phoneNumber: string) => {
        return await TempOTP.findOne( {phoneNumber});
    };
}