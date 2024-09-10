import Joi from "joi";
import Respond from "../respond";
import { Request, Response, NextFunction } from "express";

export default class AuthValidate {
    static create(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object().keys({
            fullName: Joi.string().required().min(5).max(40),
            phoneNumber: Joi.string().required().pattern(/^\+\d{1,4}-\d{7,14}$/), // Format internasional, sesuaikan dengan format yang diharapkan
            password: Joi.string().required().min(6).max(12),
            role: Joi.string().valid("admin", "user"),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return new Respond(res).success(400, {
                message: error.details[0].message.replace(/"/g, ""),
                data: undefined,
            });
        }
        next();
    }

    // static otp(req: Request, res: Response, next: NextFunction) {
    //     const schema = Joi.object().keys({
    //         phoneNumber: Joi.string().required().pattern(/^\+\d{1,4}-\d{7,14}$/), // Format internasional, sesuaikan dengan format yang diharapkan
    //         otp: Joi.number().integer().max(9999).required(),
    //     });
    //     const { error } = schema.validate(req.body);
    //     if (error) {
    //         return new Respond(res).success(400, {
    //             message: error.details[0].message.replace(/"/g, ""),
    //             data: undefined,
    //         });
    //     }
    //     next();
    // }

    static phoneNumber(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object().keys({
            phoneNumber: Joi.string().required().pattern(/^\+\d{1,4}-\d{7,14}$/), // Format internasional, sesuaikan dengan format yang diharapkan
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return new Respond(res).success(400, {
                message: error.details[0].message.replace(/"/g, ""),
                data: undefined,
            });
        }
        next();
    }

    static login(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      phoneNumber: Joi.string().required().pattern(/^\+\d{1,4}-\d{7,14}$/),
      password: Joi.string().required().min(6).max(12),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return new Respond(res).success(400, {
        message: error.details[0].message.replace(/"/g, ""),
        data: undefined,
      });
    }
    next();
  }
}


