import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Agenda } from "agenda";

dotenv.config();

const DB_URL = process.env.MONGO_DB_URL!;

export async function connectDB() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Monggose connect");
    } catch(err) {
        console.log("Monggose tidak connect: ", err);
    }
}

export const agenda = new Agenda({
    db: { address: DB_URL, collection: "databaseJobs"},
})