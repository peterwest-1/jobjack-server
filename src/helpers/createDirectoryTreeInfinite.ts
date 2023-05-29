import fs, { Stats } from "fs";
import path from "path";
import { getEntryLink } from "../app";
import { EntryData } from "../types";

//Probably doesnt even work
// not good as it uses loads everything
const createDirectoryTreeInfinite = (directoryPath: string, protocol: string, host: string): Promise<EntryData> => {
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
          createdAt: stats.birthtime,
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
            const entryPromises: Promise<EntryData>[] = entries.map((entry, index) => {
              const stats = statsArray[index];
              const entryData: EntryData = {
                name: entry,
                path: path.join(directoryPath, entry),
                size: stats.size,
                extension: path.extname(entry),
                createdAt: stats.birthtime,
                isDirectory: stats.isDirectory(),
                link: getEntryLink(path.join(directoryPath, entry), protocol, host),
              };

              if (entryData.isDirectory) {
                return createDirectoryTreeInfinite(entryData.path, protocol, host).then((childDirectory) => {
                  entryData.children = [childDirectory];
                  return entryData;
                });
              } else {
                return Promise.resolve(entryData);
              }
            });

            Promise.all(entryPromises)
              .then((entriesData) => {
                const directoryTree: EntryData = {
                  name: path.basename(directoryPath),
                  path: directoryPath,
                  isDirectory: true,
                  link: getEntryLink(directoryPath, protocol, host),
                  size: 0,
                  extension: "",
                  createdAt: stats.birthtime,
                  children: entriesData,
                };
                resolve(directoryTree);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  });
};
