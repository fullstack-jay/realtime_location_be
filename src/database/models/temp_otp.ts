import mongoose from 'mongoose';
import OTPService from '../../services/otp';
import { sendWhatsAppOTP } from '../../services/send_phone_number';

const tempOTPSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    otp: { type: Number, required: true },
});

const TempOTP = mongoose.model("TempOTP", tempOTPSchema);

const changeStream = TempOTP.watch();

changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
        const { phoneNumber, otp } = change.fullDocument;
        console.log("Kode OTP:", otp);
        sendWhatsAppOTP(phoneNumber, otp);
        OTPService.deleteOTP(change.fullDocument._id);
    }
})

export default TempOTP;