import { Request, Response } from "express";
import Movement from "../../database/models/movement";
import Respond from "../../utils/respond";

// Getting all movements
export const getAllMovements = async (req: Request, res: Response) => {
  try {
    const id: string = res.locals.accountId;

    if (!id) throw new Error("Pengguna belum login");

    const movements = await Movement.find({
      $or: [{ creatorId: id }, { actors: { $in: [id] } }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Perjalanan berhasil diambil",
      count: movements.length,
      data: movements,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Getting one movement
export const getMovement = async (req: Request, res: Response) => {
  const respond = new Respond(res);
  try {
    const { id } = req.params;
    const userId: string = res.locals.accountId;

    if (!userId) throw new Error("Pengguna belum login");
    const movement = await Movement.findById(id);
    if (!movement)
      throw new Error(
        "Perjalanan sudah tidak ada lagi, mungkin sudah dihapus oleh pemiliknya"
      );

    if (movement.creatorId == userId || movement.actors.includes(userId)) {
      return res.status(200).json({
        message: "Perjalanan berhasil diambil",
        data: movement,
      });
    } else {
      return respond.success(403, {
        message: "Anda bukan lagi anggota perjalanan ini",
        data: movement.title,
      });
    }
  } catch (error: any) {
    return respond.error(error);
  }
};

// Create new movement
export const addMovement = async (req: Request, res: Response) => {
  try {
    const id: string = res.locals.accountId;
    if (!id) throw new Error("Pengguna belum login");
    const { title, description, creator, actors } = req.body;

    const movement = await Movement.create({
      title,
      description,
      creator,
      creatorId: id,
      actors,
    });

    return res
      .status(201)
      .json({ message: "Perjalanan berhasil dibuat", movement });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Leaving movement
export const leaveMovement = async (req: Request, res: Response) => {
  const respond = new Respond(res);
  try {
    const { id } = req.params;
    const userId: string = res.locals.accountId;

    if (!userId) throw new Error("Pengguna belum login");
    const movement = await Movement.findById(id);
    if (!movement)
      throw new Error(
        "Perjalanan sudah tidak ada lagi, mungkin sudah dihapus oleh pemiliknya"
      );

    if (movement.actors.includes(userId)) {
      const newActors = movement.actors.filter((move) => move != userId);
      await Movement.findByIdAndUpdate(id, {
        actors: newActors,
      });
      return respond.success(200, {
        message: "Anda telah meninggalkan perjalanan ini selamanya",
        data: movement.title,
      });
    } else {
      return respond.success(403, {
        message: "Anda bukan lagi anggota perjalanan ini",
        data: movement.title,
      });
    }
  } catch (error: any) {
    return respond.error(error);
  }
};
//Delete movement
export const deleteMovement = async (req: Request, res: Response) => {
  try {
    const { deleteId } = req.params;
    const userId: string = res.locals.accountId;

    if (!userId) throw new Error("Pengguna belum login");

    const movement = await Movement.findOneAndDelete({
      _id: deleteId,
      creatorId: userId,
    });

    if (!movement) {
      return res.status(403).json({
        message:
          "Anda tidak diperbolehkan menghapus perjalanan ini karena Anda bukan penciptanya",
      });
    }

    return res.status(200).json({ message: "Perjalanan berhasil dihapus" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
