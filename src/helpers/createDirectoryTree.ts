import fs from "fs";
import path from "path";
import { EntryData } from "../types";
import { createEntry } from "./createEntry";

export const createDirectoryTree = async (
  directoryPath: string,
  protocol: string,
  host: string
): Promise<EntryData> => {
  try {
    const stats = await fs.promises.stat(directoryPath);

    if (!stats.isDirectory()) {
      return createEntry(directoryPath, protocol, host, stats);
    }

    const entries = await fs.promises.readdir(directoryPath);
    const statsArray = await Promise.all(entries.map((entry) => fs.promises.stat(path.join(directoryPath, entry))));

    const entriesData: EntryData[] = entries.map((entry, index) => {
      const stats = statsArray[index];

      return createEntry(directoryPath, protocol, host, stats, entry);
    });

    return createEntry(directoryPath, protocol, host, stats, null, entriesData);
  } catch (err) {
    throw err;
  }
};
