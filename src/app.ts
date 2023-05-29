import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// const directoryPath = "./dummy/"; // Replace with the directory path you want to list
const directoryPath = "../server/src/";

app.get("/directory", (req, res) => {
  const files = [];

  const processEntry = (entryPath) => {
    const stats = fs.statSync(entryPath);
    const entry = {
      filename: path.basename(entryPath),
      path: entryPath,
      size: stats.size,
      extension: path.extname(entryPath),
      isDirectory: stats.isDirectory(),
      createdDate: stats.birthtime,
    };
    files.push(entry);

    if (stats.isDirectory()) {
      const subEntries = fs.readdirSync(entryPath);
      subEntries.forEach((subEntry) => {
        const subEntryPath = path.join(entryPath, subEntry);
        processEntry(subEntryPath);
      });
    }
  };

  processEntry(directoryPath);

  res.json(files);
});

app.get("/dir1", (req, res) => {
  const root = createDirectoryTree(directoryPath);

  res.json(root);
});

const createDirectoryTree = (directoryPath) => {
  const stats = fs.statSync(directoryPath);
  const entry = {
    name: path.basename(directoryPath),
    path: directoryPath,
    size: stats.size,
    extension: path.extname(directoryPath),
    createdDate: stats.birthtime,
    isDirectory: stats.isDirectory(),
    children: [],
  };

  if (stats.isDirectory()) {
    const subEntries = fs.readdirSync(directoryPath);
    subEntries.forEach((subEntry) => {
      const subEntryPath = path.join(directoryPath, subEntry);
      const child = createDirectoryTree(subEntryPath);
      entry.children.push(child);
    });
  }

  return entry;
};

const port = 3000; // Replace with the desired port number
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
