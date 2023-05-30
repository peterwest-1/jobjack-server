export const getEntryLink = (entryPath: string, protocol: string, host: string) => {
  return `${protocol}://${host}/directory?path=${encodeURIComponent(entryPath)}`;
};
