import dotenv from "dotenv";

dotenv.config();

interface Environment {
  PORT?: string;
  MONGO_URI: string;
}

const { PORT, MONGO_URI } = process.env;


if (!MONGO_URI) {
  throw new Error("MONGO URI is required in env");
}

const config: Environment = {
  PORT,
  MONGO_URI,
};

export default config;
