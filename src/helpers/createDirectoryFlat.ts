import fs from "fs";
import path from "path";
import "reflect-metadata";
import { createEntryFlat } from "./createEntry";
import NodeCache from "node-cache";
import { EntryFlat } from "../models/EntryFlat";

//NB: Not sure of better way to implement this
//Slow first request but subsequent will be good
const flatCache = new NodeCache();

export const createDirectoryFlat = async (
  directoryPath: string,
  protocol: string,
  host: string
): Promise<EntryFlat[]> => {
  const cacheKey = `${directoryPath}`;
  const cachedResult = flatCache.get<EntryFlat[]>(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const stats = await fs.promises.stat(directoryPath);
    const entryData = createEntryFlat(directoryPath, protocol, host, stats);

    if (!stats.isDirectory()) {
      flatCache.set(cacheKey, [entryData]);
      return [entryData];
    }

    const entries = await fs.promises.readdir(directoryPath);
    const entryDataPromises = entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry);
      return createDirectoryFlat(entryPath, protocol, host);
    });

    const entriesData = await Promise.all(entryDataPromises);
    const flatData = [entryData, ...entriesData.flat()];

    flatCache.set(cacheKey, flatData);
    return flatData;
  } catch (error) {
    throw error;
  }
};
