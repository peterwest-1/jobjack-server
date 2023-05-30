import fs, { type Stats } from "fs";
import path from "path";
import { constants } from "fs";
import { getEntryLink } from "./getEntryLink";
import { EntryData } from "../types";

export const createDirectoryTree = async (
  directoryPath: string,
  protocol: string,
  host: string
): Promise<EntryData> => {
  try {
    const stats = await fs.promises.stat(directoryPath);

    if (!stats.isDirectory()) {
      return {
        name: path.basename(directoryPath),
        path: directoryPath,
        isDirectory: false,
        link: getEntryLink(directoryPath, protocol, host),
        size: 0,
        extension: "",
        createdAt: stats.birthtime,
        permissions: (stats.mode & constants.S_IRWXU) >> 6,
      };
    }

    const entries = await fs.promises.readdir(directoryPath);
    const statsArray = await Promise.all(entries.map((entry) => fs.promises.stat(path.join(directoryPath, entry))));

    const entriesData: EntryData[] = entries.map((entry, index) => {
      const stats = statsArray[index];
      const isDirectory = stats.isDirectory();
      return {
        name: entry,
        path: path.join(directoryPath, entry),
        size: stats.size,
        extension: path.extname(entry),
        createdAt: stats.birthtime,
        isDirectory: isDirectory,
        permissions: (stats.mode & constants.S_IRWXU) >> 6, // Extract user permission
        link: getEntryLink(path.join(directoryPath, entry), protocol, host),
      };
    });

    return {
      name: path.basename(directoryPath),
      path: directoryPath,
      isDirectory: true,
      link: getEntryLink(directoryPath, protocol, host),
      size: 0,
      extension: "",
      createdAt: stats.birthtime,
      permissions: (stats.mode & constants.S_IRWXU) >> 6, // Extract user permissions
      children: entriesData,
    };
  } catch (err) {
    throw err;
  }
};
