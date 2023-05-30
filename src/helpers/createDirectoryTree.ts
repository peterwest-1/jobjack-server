import fs from "fs";
import path from "path";
import { getEntryLink } from "./getEntryLink";

export const createDirectoryTree = async (directoryPath: string, protocol: string, host: string) => {
  try {
    const stats = await fs.promises.stat(directoryPath);

    if (!stats.isDirectory()) {
      throw new Error("Specified path is not a directory.");
    }

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
  } catch (error) {
    console.error("Error occurred while creating directory tree:", error);
    throw error;
  }
};
