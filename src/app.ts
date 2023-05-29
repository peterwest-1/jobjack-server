import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/directory", (req, res) => {
  const directoryPath = req.query.path || "../server/src"; // Default directory path if not provided
  const root = createDirectoryTree(directoryPath, req.protocol, req.get("host"));
  res.json(root);
});

const createDirectoryTree = (directoryPath, protocol, host) => {
  const stats = fs.statSync(directoryPath);
  const entry = {
    name: path.basename(directoryPath),
    path: directoryPath,
    size: stats.size,
    extension: path.extname(directoryPath),
    createdDate: stats.birthtime,
    isDirectory: stats.isDirectory(),
    link: getEntryLink(directoryPath, protocol, host),
    children: [],
  };

  if (stats.isDirectory()) {
    const subEntries = fs.readdirSync(directoryPath);
    subEntries.forEach((subEntry) => {
      const subEntryPath = path.join(directoryPath, subEntry);
      const child = createDirectoryTree(subEntryPath, protocol, host);
      entry.children.push(child);
    });
  }

  return entry;
};

const getEntryLink = (entryPath, protocol, host) => {
  return `${protocol}://${host}/directory?path=${encodeURIComponent(entryPath)}`;
};

const port = 3000; // Replace with the desired port number
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
