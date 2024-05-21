import mongoose from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGO_URI ?? 'mongodb://root:password@mongodb:27021/oz-tech-test?authSource=admin'

const init = async function() {
  await mongoose.connect(URI);
};

export default init();