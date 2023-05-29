import express, { Request, Response } from "express";
import fs, { Stats } from "fs";
import path from "path";
import { EntryData } from "./types";

const DEFAULT_PATH = "../server/src";
const app = express();

app.get("/directory", async (req, res) => {
  const directoryPath = (req.query.path as string) || DEFAULT_PATH;
  const root = await createDirectoryTree(directoryPath, req.protocol, req.get("host"));

  res.json(root);
});

const createDirectoryTree = (directoryPath: string, protocol: string, host: string): Promise<EntryData> => {
  return new Promise((resolve, reject) => {
    fs.stat(directoryPath, (err, stats) => {
      if (err) {
        return reject(err);
      }

      if (!stats.isDirectory()) {
        const entry: EntryData = {
          name: path.basename(directoryPath),
          path: directoryPath,
          isDirectory: false,
          link: getEntryLink(directoryPath, protocol, host),
          size: 0,
          extension: "",
          createdDate: stats.birthtime,
        };
        return resolve(entry);
      }

      fs.readdir(directoryPath, (err, entries) => {
        if (err) {
          return reject(err);
        }

        const statsPromises = entries.map((entry) => {
          const entryPath = path.join(directoryPath, entry);
          return new Promise<Stats>((resolve, reject) => {
            fs.stat(entryPath, (err, stats) => {
              if (err) {
                reject(err);
              } else {
                resolve(stats);
              }
            });
          });
        });

        Promise.all(statsPromises)
          .then((statsArray) => {
            const entriesData: EntryData[] = entries.map((entry, index) => {
              const stats = statsArray[index];
              const isDirectory = stats.isDirectory();
              const entryData: EntryData = {
                name: entry,
                path: path.join(directoryPath, entry),
                size: stats.size,
                extension: path.extname(entry),
                createdDate: stats.birthtime,
                isDirectory: isDirectory,
                link: getEntryLink(path.join(directoryPath, entry), protocol, host),
              };
              return entryData;
            });

            const directoryTree: EntryData = {
              name: path.basename(directoryPath),
              path: directoryPath,
              isDirectory: true,
              link: getEntryLink(directoryPath, protocol, host),
              size: 0,
              extension: "",
              createdDate: stats.birthtime,
              children: entriesData,
            };
            resolve(directoryTree);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  });
};

export const getEntryLink = (entryPath: string, protocol: string, host: string) => {
  return `${protocol}://${host}/directory?path=${encodeURIComponent(entryPath)}`;
};

const port = 3000;

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
