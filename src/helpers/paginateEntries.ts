import { EntryFlat } from "../models/EntryFlat";

export const paginateEntries = async (
  entries: EntryFlat[],
  pageOffset: number,
  pageSize: number
): Promise<EntryFlat[]> => {
  const startIndex = pageOffset * pageSize;
  const endIndex = startIndex + pageSize;
  return entries.slice(startIndex, endIndex);
};
