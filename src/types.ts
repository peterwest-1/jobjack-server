import { Request, Response } from "express";

export interface EntryData {
  name: string;
  path: string;
  size: number;
  extension: string;
  createdAt: Date;
  isDirectory: boolean;
  link: string;
  children?: EntryData[];
  hasChildren?: boolean;
  permissions?: string;
}

export interface MyContext {
  req: Request;
  res: Response;
}
