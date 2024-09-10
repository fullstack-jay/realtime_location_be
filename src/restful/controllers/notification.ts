import Notification from "../../database/models/notification";
import { Request, Response } from "express";


export async function sendNotification (
    message: string,
    action: string,
    to: string,
    data: any
) {
   try {
    await Notification.create({
        message,
        action,
        to,
        data,
    });
   }  catch(error: any){
    console.log(error);
   }
}

export const getNotifications = async (req: Request, res: Response) =>{
    try {
        const id: string = res.locals.accountId;
        if (!id) throw new Error("Pengguna belum login");
        const notifications = await Notification.find({ to:id }).sort({
            createdAt: "desc",
        });
        res.status(200).json({
            message: "Notifikasi sukses diambil",
            count: notifications.length,
            notifications,
        });
    } catch(error: any) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const deleteNotification = async(req: Request, res: Response) => {
    try {
        const { id }  = req.params;

        const to: string = res.locals.accountId;
        if(!to) throw new Error("User belum login");

        const notification = await Notification.findOneAndDelete({ _id: id, to });

        if(!notification) {
            return res.status(404).json({
                message: "Notifikasi tidak ditemukan"
            });
        }

        return res.status(200).json( {message: "Notifikasi berhasil dihapus"});
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
