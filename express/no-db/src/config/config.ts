import { ConfigValues } from "../constant/config-values";
import * as fs from "fs";
import dotenv from "dotenv";
import { DefaultConfigValues } from "../constant/default-config-values";

const env = process.env.NODE_ENV;
const defaultFilePath = ConfigValues.CONFIG_PATH + ConfigValues.DEVELOPMENT_EVN;
const currentFilePath =
  ConfigValues.CONFIG_PATH + ConfigValues.ENV_EXTENSION + env;

fs.access(currentFilePath, (error) => {
  if (error) {
    dotenv.config({
      path: defaultFilePath,
    });
  } else {
    dotenv.config({
      path: currentFilePath,
    });
  }
});

export const config = {
  db: {
    DB_HOST: process.env.DB_HOST || DefaultConfigValues.DB_HOST,
    DB_NAME: process.env.DB_NAME || DefaultConfigValues.DB_NAME,
    DB_TYPE: process.env.DB_TYPE || DefaultConfigValues.DB_TYPE,
    DB_USER: process.env.DB_USER || DefaultConfigValues.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD || DefaultConfigValues.DB_PASSWORD,
    DB_PORT: Number(process.env.DB_PORT) || DefaultConfigValues.DB_PORT,
  },
  env: {
    APP_MODE_IS_PROD: env == "production",
  },
  server: {
    port: Number(process.env.APP_PORT) || DefaultConfigValues.APP_PORT,
    jwt: {
      accessSecret:
        process.env.ACCESS_SECRET || DefaultConfigValues.ACCESS_SECRET,
      refreshSecret:
        process.env.REFRESH_SECRET || DefaultConfigValues.REFRESH_SECRET,
      expiresInRefresh:
        process.env.REFRESH_EXP || DefaultConfigValues.REFRESH_EXP,
      expiresInRefreshCookie:
        Number(process.env.REFRESH_COOKIE_EXP) ||
        DefaultConfigValues.REFRESH_COOKIE_EXP,
      expiresInAccess: process.env.ACCESS_EXP || DefaultConfigValues.ACCESS_EXP,
    },
  },
};
