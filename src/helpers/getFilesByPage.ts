import { BFSState } from "../types";
import { BFSSearch } from "./createDirectoryBFS";

export const getFilesByPage = async (
  directoryPath: string,
  pageOffset: number,
  pageSize: number
): Promise<string[]> => {
  const searchLimit = pageOffset * pageSize + pageSize;

  let currentState: BFSState | undefined = undefined;
  let entries: string[] = [];

  while (entries.length < searchLimit) {
    const result = await BFSSearch(directoryPath, searchLimit - entries.length, currentState);
    entries = entries.concat(result.entries);
    currentState = result.state;

    if (result.entries.length === 0) {
      // No more files/folders to search
      break;
    }
  }

  const startIndex = pageOffset * pageSize;
  const endIndex = startIndex + pageSize;
  return entries.slice(startIndex, endIndex);
};
