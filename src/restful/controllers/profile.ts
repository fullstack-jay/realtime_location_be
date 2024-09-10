import Respond from "../../utils/respond";
import { Response, Request } from "express";
import Profile from "../../database/models/profile";
import mongoose from "mongoose";
export default class ProfileController {
  /// Create profile of the user
  static createProfile = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const userId: string = res.locals.accountId;
      if (!userId) throw new Error("Pengguna belum login");

      const imgUrl = res.locals.profileImageUrl;

      const { username, email } = req.body;
      if (!imgUrl || !username || !email)
        throw new Error("Semua kolom wajib diisi");

      const profile = await Profile.create({ username, email, imgUrl, userId });

      return respond.success(200, {
        message: "Pengguna berhasil membuat profil",
        data: profile,
        // data: profile,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static getProfile = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const userId: string = res.locals.accountId;

      if (!userId) throw new Error("Pengguna belum login");

      const profile = await Profile.findOne({ userId });

      return respond.success(200, {
        message: "Profil pengguna berhasil diambil",
        data: profile,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static getMultipleProfiles = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const userId: string = res.locals.accountId;

      if (!userId) throw new Error("Pengguna belum login");

      const ids = req.body.users.filter(
        (id: string, index: number) =>
          mongoose.Types.ObjectId.isValid(id) &&
          req.body.users.indexOf(id) === index
      );
      if (ids.length < 1) {
        return respond.success(400, {
          message: "Tidak dapat menemukan pengguna yang dipilih",
          data: undefined,
        });
      }
      const profiles = await Profile.find({ userId: { $in: ids } });

      return respond.success(200, {
        message: "Profil berhasil diambil",
        count: profiles.length,
        data: profiles,
      });
    } catch (error) {
      return respond.error(error);
    }
  };
}
