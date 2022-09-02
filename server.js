import bodyParser from "body-parser";
import express from "express";
import router from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`${process.env.APP_URL}:${port}`);
});
