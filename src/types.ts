import { Request, Response } from "express";

export interface BFSState {
  queue: string[];
  searched: Set<string>;
}

export interface BFSResult {
  entries: string[];
  state: BFSState;
}

export interface MyContext {
  req: Request;
  res: Response;
}
