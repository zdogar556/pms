import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import morgan from "morgan";
import routes from "./routes/index.routes.js";

dotenv.config();

const app = express();

// Configure morgan logger
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :body'));

app.use(express.json());
app.use(cors());

app.use("/api", routes);
app.get("/", (req, res) => res.send("PMS server Working"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
