import fs, { Stats } from "fs";
import path from "path";
import { getEntryLink } from "./getEntryLink";
import { createEntry } from "./createEntry";
import { EntryTree } from "../models/EntryTree";

//Probably doesnt even work
//Not viable
//GraphQL doesnt support infinite depth

export const createDirectoryTreeComplete = async (directoryPath: string, protocol: string, host: string) => {
  try {
    const stats = await fs.promises.stat(directoryPath);

    if (!stats.isDirectory()) {
      return createEntry(directoryPath, protocol, host, stats);
    }

    const entries = await fs.promises.readdir(directoryPath);
    const statsArray = await Promise.all(entries.map((entry) => fs.promises.stat(path.join(directoryPath, entry))));

    const entryPromises = entries.map(async (entry, index) => {
      const stats = statsArray[index];
      const entryData: EntryTree = {
        name: entry,
        path: path.join(directoryPath, entry),
        size: stats.size,
        extension: path.extname(entry),
        createdAt: stats.birthtime,
        isDirectory: stats.isDirectory(),
        link: getEntryLink(path.join(directoryPath, entry), protocol, host),
      };

      if (entryData.isDirectory) {
        const childDirectory = await createDirectoryTreeComplete(entryData.path, protocol, host);
        entryData.children = [childDirectory];
        return entryData;
      } else {
        return entryData;
      }
    });

    const entriesData = await Promise.all(entryPromises);

    const directoryTree: EntryTree = {
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
  } catch (err) {
    throw err;
  }
};
