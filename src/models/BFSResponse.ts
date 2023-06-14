import { ObjectType, Field } from "type-graphql";
import { EntryFlat } from "./EntryFlat";
@ObjectType()
export class BFSResponse {
  @Field(() => [EntryFlat])
  entries: [EntryFlat];

  @Field({ nullable: true })
  nextPageToken?: string;
}
