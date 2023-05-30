import cors from "cors";
import express, { Request, Response } from "express";
import { createDirectoryTree } from "./helpers/createDirectoryTree";

const DEFAULT_PATH = "../server";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200"],
  })
);
app.get("/", async (req: Request, res: Response) => {
  res.send("JobJack-Server-REST");
});

app.get("/directory", async (req: Request, res: Response) => {
  const directoryPath = (req.query.path as string) || DEFAULT_PATH;
  try {
    const root = await createDirectoryTree(directoryPath, req.protocol, req.get("host"));
    res.json(root);
  } catch (error) {
    //TODO: maker better
    res.status(500).json("Fix this:" + error);
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`JobJack-Server-REST is running on port ${port}`);
});
