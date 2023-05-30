import cors from "cors";
import express, { Request, Response } from "express";
import { createDirectoryTree } from "./helpers/createDirectoryTree";
import NodeCache from "node-cache";

const DEFAULT_PATH = "./";
const app = express();

const cache = new NodeCache(); //In-memory cache
const CACHE_TTL = 60 * 60; // 1 hour;

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

  const cachedListing = cache.get(directoryPath);

  if (cachedListing) {
    res.json(cachedListing);
  } else {
    try {
      const root = await createDirectoryTree(directoryPath, req.protocol, req.get("host"));
      cache.set(directoryPath, root, CACHE_TTL);
      res.json(root);
    } catch (error) {
      res.status(500).json("Fix this:" + error);
    }
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`JobJack-Server-REST is running on port ${port}`);
});
