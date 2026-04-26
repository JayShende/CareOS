import express from "express";
import "dotenv/config";
import routes from "./routes";
import cors from "cors";
// import authMiddleware from "./middlewares/auth.middleware";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
// app.use(authMiddleware);
app.use("/v1", routes);
// .env varibales
const { PORT } = process.env;

app.listen(Number(PORT), () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
