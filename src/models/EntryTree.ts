import { Field, ObjectType } from "type-graphql";
import { EntryFlat } from "./EntryFlat";

@ObjectType()
export class EntryTree extends EntryFlat {
  @Field(() => [EntryTree], { nullable: true })
  children?: EntryTree[];

  @Field({ nullable: true })
  hasChildren?: boolean;

  @Field({ nullable: true })
  permissions?: string;
}
