import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const DEFAULT_PATH = "../server";
const app = express();

app.get("/directory", async (req: Request, res: Response) => {
  const directoryPath = (req.query.path as string) || DEFAULT_PATH;
  const root = await createDirectoryTree(directoryPath, req.protocol, req.get("host"));
  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
  res.json(root);
});

const createDirectoryTree = async (directoryPath: string, protocol: string, host: string) => {
  const stats = await fs.promises.stat(directoryPath);

  const entries = await fs.promises.readdir(directoryPath);
  const statsArray = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry);
      const entryStats = await fs.promises.stat(entryPath);
      return entryStats;
    })
  );

  const entriesData = entries.map((entry, index) => {
    const stats = statsArray[index];
    const isDirectory = stats.isDirectory();
    const entryData = {
      name: entry,
      path: path.join(directoryPath, entry),
      size: stats.size,
      extension: path.extname(entry),
      createdAt: stats.birthtime,
      isDirectory,
      link: getEntryLink(path.join(directoryPath, entry), protocol, host),
    };
    return entryData;
  });

  const directoryTree = {
    name: path.basename(directoryPath),
    path: directoryPath,
    isDirectory: true,
    link: getEntryLink(directoryPath, protocol, host),
    size: 0,
    extension: "",
    createdAt: stats.birthtime,
    children: entriesData,
  };

  return directoryTree;
};

export const getEntryLink = (entryPath: string, protocol: string, host: string) => {
  return `${protocol}://${host}/directory?path=${encodeURIComponent(entryPath)}`;
};

const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200/",
  })
);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
