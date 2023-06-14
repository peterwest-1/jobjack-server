import { EntryFlat } from "../models/EntryFlat";
import { createEntry } from "./createEntry";
import fs from "fs";

export const getInformationForDirectory = async (directories: string[], protocol: string, host: string) => {
  return await Promise.all(
    directories
      .map(async (entry) => {
        try {
          const stats = await fs.promises.stat(entry);
          const entryData = createEntry(entry, protocol, host, stats) as EntryFlat;
          return entryData;
        } catch (error) {
          console.error(`Error processing entry: ${entry}`, error);
          return null; // or a default value
        }
      })
      .filter((result) => result !== null)
  );
};
