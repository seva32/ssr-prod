/* eslint-disable no-console */
import dotenv from "dotenv";
import path from "path";
import express from "express";
import cookiesMiddleware from "universal-cookie-express";
import compression from "compression";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Loadable from "react-loadable";
import logger from "./middleware/logger";
import { devMiddleware, hotMiddleware } from "./middleware/webpack";
import router from "./router/router";

dotenv.config({ silent: true });

mongoose.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.set("x-powered-by", false);

app.use(compression());
app.use(logger);
app.use(bodyParser.json({ type: "*/*" }));
app.use(cors());
app.use(cookiesMiddleware());

if (process.env.NODE_ENV === "production") {
  app.use("/build", express.static(path.join(__dirname, "build")));
} else {
  app.use(devMiddleware);
  app.use(hotMiddleware);
}

router(app);

Loadable.preloadAll()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(
        "Express started at http://localhost:%d\n",
        server.address().port
      );
      if (process.env.NODE_ENV !== "production") {
        console.log("Waiting for webpack...\n");
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
