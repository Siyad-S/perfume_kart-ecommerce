import dotenv from 'dotenv';
import { cleanEnv, str, port, url } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
  CONNECTION_URL: str(),
  JWT_SECRET: str(),
  REFRESH_SECRET: str(),
  CLIENT_URL: url(),
});

interface Config {
  port: number;
  nodeEnv: string;
  connectionUrl: string;
  jwtSecret: string;
  refreshSecret: string;
  clientUrl: string;
}

const config: Config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  connectionUrl: env.CONNECTION_URL,
  jwtSecret: env.JWT_SECRET,
  refreshSecret: env.REFRESH_SECRET,
  clientUrl: env.CLIENT_URL,
};

export default config;