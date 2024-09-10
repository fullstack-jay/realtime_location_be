import { Request, Response, NextFunction } from "express";
import Respond from "../../utils/respond";
import { getImageUrl, uploadFileToCloudinary } from "../../utils/cloudinary";

import fs from "fs";
import util from "util";

const unlinkFile = util.promisify(fs.unlink);

export const uploadPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const respond = new Respond(res);
  try {
    if (!req.file) throw new Error("Foto Profil Diperlukan");

    await uploadFileToCloudinary(req.file.path);

    await unlinkFile(req.file.path);

    const imgUrl = await getImageUrl(req.file.filename);

    res.locals.profileImageUrl = imgUrl;
    next();
  } catch (error) {
    return respond.error(error);
  }
};
