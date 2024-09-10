import { Request, Response, NextFunction } from "express";
import Account from "../../database/models/account";
import { verifyToken } from "../../utils/helpers";
import Respond from "../../utils/respond";

export default class AuthMiddleWare {
  //check if the user already has account
  static async isAccountExist(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      const { phoneNumber } = req.body;
      const exist = await Account.findOne({ phoneNumber });
      if (exist) {
        return respond.success(409, {
          message: "Akun sudah terdaftar",
          data: undefined,
        });
      }
      next();
    } catch (error) {
      return respond.error(error);
    }
  }

  //check if the account is authorized
  static async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      if (!req.headers.authorization) {
        return respond.success(400, {
          message: "Pengguna belum login",
          data: undefined,
        });
      }
      const { accountId } = verifyToken(
        req.headers.authorization.split(" ")[1]
      );
      if (!accountId) {
        throw new Error("Token Salah");
      }
      res.locals.accountId = accountId;
      next();
    } catch (error: any) {
      return respond.success(400, {
        message: "Token salah",
        data: error.message,
      });
    }
  }

  //Check if the user is admin
  static async isAdmin(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      const id: string = res.locals.accountId;
      if (!id) throw new Error("Pengguna belum login");
      const exist = await Account.findById(id);
      if (!exist) {
        return respond.success(404, {
          message: "Akun tidak ada",
          data: undefined,
        });
      }
      if (exist.role !== "admin") {
        return respond.success(401, {
          message: "Login sebagai admin untuk melakukan tindakan ini",
          data: undefined,
        });
      }
      next();
    } catch (error) {
      return respond.error(error);
    }
  }
}
