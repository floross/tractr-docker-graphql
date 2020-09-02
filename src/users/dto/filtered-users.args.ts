import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FilteredUsersArgs {
  @Field(() => String, { nullable: true })
  contains = '';

  @Field(() => Date, { nullable: true })
  startDate;

  @Field(() => Date, { nullable: true })
  endDate = '';

  @Field(() => String, { nullable: true })
  nationality = '';

  @Field(() => String, { nullable: true })
  cursor;

  @Field(() => Int, { nullable: true })
  take;
}
