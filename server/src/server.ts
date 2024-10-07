import express, { Request, Response } from "express";
import router from "./routes";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3300;

// app.get("/", (req: Request, res: Response) => {
//   res.status(201).json({ message: `Server running on ${PORT}` });
// });

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
