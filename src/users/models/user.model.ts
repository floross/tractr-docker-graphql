import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  salt: string;

  @Field()
  name: string;

  @Field()
  phone: string;

  @Field()
  pictureUrl: string;

  @Field()
  nationality: string;

  @Field()
  gender: string;

  @Field()
  birthdate: Date;
}
