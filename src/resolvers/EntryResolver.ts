import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { EntryData } from "../models/Entry";
import { MyContext } from "../types";
import { createDirectoryTree } from "../helpers/createDirectoryTree";
import { createDirectoryTreeComplete } from "../helpers/createDirectoryTreeComplete";

const DEFAULT_PATH = "./";

@Resolver()
export class EntryResolver {
  @Query((returns) => EntryData)
  async entry(
    @Arg("path", { nullable: true, defaultValue: DEFAULT_PATH }) path: string,
    @Ctx() { req }: MyContext
  ): Promise<EntryData> {
    const directoryPath = path;
    const root = await createDirectoryTree(directoryPath, req.protocol, req.get("host"));
    return root;
  }
}
