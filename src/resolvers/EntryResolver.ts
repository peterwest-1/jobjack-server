import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { createDirectoryTree } from "../helpers/createDirectoryTree";
import { EntryTree } from "../models/EntryTree";
import { EntryFlat } from "../models/EntryFlat";
import { MyContext } from "../types";
import { paginateEntries } from "../helpers/paginateEntries";
import { createDirectoryFlat } from "../helpers/createDirectoryFlat";

const DEFAULT_PATH = "./";

@Resolver()
export class EntryResolver {
  @Query((returns) => EntryTree)
  async entryTree(
    @Arg("path", { nullable: true, defaultValue: DEFAULT_PATH }) path: string,
    @Ctx() { req }: MyContext
  ): Promise<EntryTree> {
    const directoryPath = path;
    const protocol = req.protocol;
    const host = req.get("host");
    const root = await createDirectoryTree(directoryPath, protocol, host);
    return root;
  }

  @Query((returns) => [EntryFlat])
  async entryFlat(
    @Arg("path", { nullable: true, defaultValue: DEFAULT_PATH }) path: string,
    @Arg("pageSize", () => Int) pageSize: number,
    @Arg("pageOffset", () => Int) pageOffset: number,
    @Ctx() { req }: MyContext
  ): Promise<EntryFlat[]> {
    const directoryPath = path;
    const protocol = req.protocol;
    const host = req.get("host");

    const flat = await createDirectoryFlat(directoryPath, protocol, host);
    const paginatedFlat = paginateEntries(flat, pageOffset, pageSize);
    return paginatedFlat;
  }
}
