import fs from "fs";
import path from "path";
import "reflect-metadata";
import { createEntry } from "./createEntry";
import NodeCache from "node-cache";
import { EntryTree } from "../models/EntryTree";

//NB: Not sure of better way to implement this
//Slow first request but subsequent will be good
const entryCache = new NodeCache();

export const createDirectoryTree = async (
  directoryPath: string,
  protocol: string,
  host: string
): Promise<EntryTree> => {
  const cacheKey = `${directoryPath}`;

  const cachedResult = entryCache.get<EntryTree>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const stats = await fs.promises.stat(directoryPath);

    if (!stats.isDirectory()) {
      const cacheValue = createEntry(directoryPath, protocol, host, stats);
      entryCache.set(cacheKey, cacheValue);
      return cacheValue;
    }

    const entries = await fs.promises.readdir(directoryPath);
    const statsArray = await Promise.all(entries.map((entry) => fs.promises.stat(path.join(directoryPath, entry))));

    const entriesData: EntryTree[] = entries.map((entry, index) => {
      const stats = statsArray[index];

      const cacheValue = createEntry(directoryPath, protocol, host, stats, entry);
      entryCache.set(cacheKey, cacheValue);
      return cacheValue;
    });

    const cacheValue = createEntry(directoryPath, protocol, host, stats, null, entriesData);
    entryCache.set(cacheKey, cacheValue);
    return cacheValue;
  } catch (error) {
    throw error;
  }
};
