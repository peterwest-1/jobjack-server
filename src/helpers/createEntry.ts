import { Stats } from "fs";
import path from "path";
import { getFilePermissionInfo } from "./filePermission";
import { getEntryLink } from "./getEntryLink";
import { EntryData } from "../models/Entry";

export const createEntry = (
  directoryPath: string,
  protocol: string,
  host: string,
  stats: Stats,
  entry?: string,
  entriesData?: EntryData[]
): EntryData => {
  const isDirectory = stats.isDirectory();

  const base = {
    size: stats.size,
    createdAt: stats.birthtime,
    isDirectory: isDirectory,
    permissions: getFilePermissionInfo(stats.mode).description, // Extract user permission
  };
  return entry
    ? {
        ...base,
        name: entry,
        extension: path.extname(entry),
        path: path.join(directoryPath, entry),
        link: getEntryLink(path.join(directoryPath, entry), protocol, host),
      }
    : {
        ...base,
        name: path.basename(directoryPath),
        path: directoryPath,
        extension: "",
        link: getEntryLink(directoryPath, protocol, host),
        children: entriesData,
      };
};
