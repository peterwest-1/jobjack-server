import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class EntryFlat {
  @Field()
  name: string;

  @Field()
  path: string;

  @Field()
  size: number;

  @Field({ nullable: true })
  extension?: string;

  @Field()
  createdAt: Date;

  @Field()
  isDirectory: boolean;

  @Field()
  link: string;

  @Field({ nullable: true })
  permissions?: string;
}
