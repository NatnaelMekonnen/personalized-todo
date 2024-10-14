import mongoose from "mongoose";
import config from "./env.config";

const { MONGO_URI } = config;

export const connection = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI).catch((e) => {
      console.error(`Connection did not succeed${e}`);
      process.exit(1);
    });

    console.log(`Connected to MongoDB ${connect.connection.host}`);
  } catch (error) {
    return error;
  }
};

export const dropDB = async () => {
  try {
    for (const collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].drop().then(() => {
        console.log(`${collection} dropped!!`);
      });
    }
  } catch (error) {
    throw error;
  }
};

export const dropCollection = async (collection: string) => {
  try {
    mongoose.connection.collections[collection].drop().then(() => {
      console.log(`${collection} dropped`);
    });
  } catch (error) {
    throw error;
  }
};
