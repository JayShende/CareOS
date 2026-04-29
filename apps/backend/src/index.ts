import express from "express";
import "dotenv/config";
import cors from "cors";
// import authMiddleware from "./middlewares/auth.middleware";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth)); //For ExpressJS v5

// app.use(authMiddleware);
app.use(express.json());
app.use("/v1", routes);

// .env varibales
const { PORT } = process.env;

app.listen(Number(PORT), () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
