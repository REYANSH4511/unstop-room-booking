import { Router } from "express";
import apiV1Router from "./v1/index.js";

const apiRouter = Router();

apiRouter.use("/v1", apiV1Router);

export default apiRouter;
