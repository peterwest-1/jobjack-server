import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class EntryData {
  @Field()
  name: string;

  @Field()
  path: string;

  @Field()
  size: number;

  @Field()
  extension: string;

  @Field()
  createdAt: Date;

  @Field()
  isDirectory: boolean;

  @Field()
  link: string;

  @Field(() => [EntryData], { nullable: true })
  children?: EntryData[];

  @Field({ nullable: true })
  hasChildren?: boolean;

  @Field({ nullable: true })
  permissions?: boolean;
}
