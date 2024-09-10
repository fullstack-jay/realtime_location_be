import * as dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

export function sendWhatsAppOTP(phoneNumber: string, otp:number) {
    const ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID!;
    const AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN!;
    const FROM_NUMBER: string = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`;

    const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

    const messageBody = `Verifikasi nomor WhatsApp kamu dengan memasukkan OTP di bawah ini: ${otp}\nTolong catat OTP ini karena akan expired dalam 2 jam.`;

    client.messages.create({
        body: messageBody,
        from: FROM_NUMBER,
        to: `whatsapp:${phoneNumber}`
    })
    .then((message) => {
        console.log("Pesan WhatsApp sukses dikirim, SID pesan:", message.sid);
    })
    .catch((error) => {
        console.error("Gagal mengirim pesan WhatsApp:", error);
    });
}