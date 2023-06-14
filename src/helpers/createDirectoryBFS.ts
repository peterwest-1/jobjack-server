import fs from "fs";
import path from "path";
import { BFSResult, BFSState } from "../types";

export const BFSSearch = async (directoryPath: string, limit: number, state?: BFSState): Promise<BFSResult> => {
  const initialState: BFSState = {
    queue: [directoryPath],
    searched: new Set<string>(),
  };

  const currentState = state || initialState;

  const queue: string[] = [...currentState.queue];
  const searched: Set<string> = new Set(currentState.searched);

  const entries: string[] = [];

  while (queue.length > 0 && entries.length < limit) {
    const currentDirectory = queue.shift();

    if (!currentDirectory) continue;

    const files = await fs.promises.readdir(currentDirectory);

    files.map((file) => {
      const filePath = path.join(currentDirectory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        //Adds directories
        entries.push(filePath);

        if (!searched.has(filePath)) {
          queue.push(filePath);
          searched.add(filePath);
        }
      } else {
        entries.push(filePath);
      }
    });
  }

  const nextState: BFSState = {
    queue: queue.slice(),
    searched: new Set(searched),
  };

  return {
    entries,
    state: nextState,
  };
};
