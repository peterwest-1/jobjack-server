import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { createDirectoryFlat } from "../helpers/createDirectoryFlat";
import { createDirectoryTree } from "../helpers/createDirectoryTree";
import { getFilesByPage } from "../helpers/getFilesByPage";
import { getInformationForDirectory } from "../helpers/getInformationForDirectory";
import { paginateEntries } from "../helpers/paginateEntries";
import { EntryFlat } from "../models/EntryFlat";
import { EntryTree } from "../models/EntryTree";
import { MyContext } from "../types";

const DEFAULT_PATH = "./";

@Resolver()
export class EntryResolver {
  @Query(() => EntryTree)
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

  @Query(() => [EntryFlat])
  async entryFlat(
    @Arg("path", { nullable: true, defaultValue: DEFAULT_PATH }) path: string,
    @Arg("pageSize", () => Int, { defaultValue: 10 }) pageSize: number,
    @Arg("pageOffset", () => Int, { defaultValue: 0 }) pageOffset: number,
    @Ctx() { req }: MyContext
  ): Promise<EntryFlat[]> {
    const directoryPath = path;
    const protocol = req.protocol;
    const host = req.get("host");

    const flat = await createDirectoryFlat(directoryPath, protocol, host);
    const paginatedFlat = paginateEntries(flat, pageOffset, pageSize);
    return paginatedFlat;
  }
  @Query(() => [EntryFlat])
  async entryBFS(
    @Arg("path", { nullable: true, defaultValue: DEFAULT_PATH }) path: string,
    @Arg("pageSize", () => Int, { defaultValue: 10 }) pageSize: number,
    @Arg("pageOffset", () => Int, { defaultValue: 0 }) pageOffset: number,
    @Ctx() { req }: MyContext
  ): Promise<EntryFlat[]> {
    const directoryPath = path;
    const protocol = req.protocol;
    const host = req.get("host");

    const files = await getFilesByPage(directoryPath, pageOffset, pageSize);
    const result = await getInformationForDirectory(files, protocol, host);

    return result;
  }
}
