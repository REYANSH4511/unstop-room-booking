import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

/**
 * Environment variables schema with defaults and validation.
 * Follows the car-pool-app pattern for strict config validation.
 */
const envVarsSchema = Joi.object({
  PORT: Joi.number().default(8080),
  NODE_ENV: Joi.string().valid("development", "production", "local", "test").default("development"),
  APP_URL: Joi.string().default("http://localhost:8080"),
  FRONTEND_URL: Joi.string().default("http://localhost:5173"),
  LOG_LEVEL: Joi.string().valid("error", "warn", "info", "debug").default("debug"),
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/**
 * Centralized constants for the Hotel Reservation Backend.
 */
const constants = {
  port: envVars.PORT as number,
  nodeEnv: envVars.NODE_ENV as string,
  appURL: envVars.APP_URL as string,
  frontendURL: envVars.FRONTEND_URL as string,
  logLevel: envVars.LOG_LEVEL as string,
  _startedAt: Date.now(),

  /** Hotel Structure Constants */
  hotel: {
    totalFloors: 10,
    roomsPerFloor: [10, 10, 10, 10, 10, 10, 10, 10, 10, 7],
    maxBookingRooms: 5,
  },

  /** Travel Time Constants */
  travel: {
    minutesPerRoom: 1,
    minutesPerFloor: 2,
  },
};

export default constants;
