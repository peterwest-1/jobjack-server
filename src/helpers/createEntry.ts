import { Stats } from "fs";
import path from "path";
import { getFilePermissionInfo } from "./filePermission";
import { getEntryLink } from "./getEntryLink";
import { EntryFlat } from "../models/EntryFlat";
import { EntryTree } from "../models/EntryTree";

export const createEntry = (
  directoryPath: string,
  protocol: string,
  host: string,
  stats: Stats,
  entry?: string,
  entriesData?: EntryTree[]
): EntryTree | EntryFlat => {
  const isDirectory = stats.isDirectory();

  const base = {
    size: stats.size,
    createdAt: stats.birthtime,
    isDirectory: isDirectory,
    permissions: getFilePermissionInfo(stats.mode).description,
  };

  const entryPath = entry ? path.join(directoryPath, entry) : directoryPath;
  const link = getEntryLink(entryPath, protocol, host);

  if (entry) {
    return {
      ...base,
      name: entry,
      extension: path.extname(entry),
      path: entryPath,
      link: link,
    };
  } else {
    return {
      ...base,
      name: path.basename(directoryPath),
      path: directoryPath,
      extension: "",
      link: link,
      children: entriesData,
    };
  }
};
