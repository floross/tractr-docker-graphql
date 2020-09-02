import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../models/user.model';

@ObjectType()
export class UserSearchResult {
  @Field(() => [User])
  users = [];

  @Field(() => Int)
  count = 0;

  @Field(() => String, { nullable: true })
  cursor;
}
