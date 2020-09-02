import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSearchResult } from './dto/user-search-result.object';
import { FilteredUsersArgs } from './dto/filtered-users.args';
import { FindManyUserArgs } from '@prisma/client';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => [String])
  async getAllNationalities(): Promise<string[]> {
    return (
      await this.prismaService.user.findMany({
        distinct: 'nationality',
        select: { nationality: true },
      })
    ).reduce<string[]>((acc, user) => {
      acc.push(user.nationality);
      return acc;
    }, []);
  }

  @Query(() => UserSearchResult)
  async getFilteredUsers(
    @Args()
    {
      contains,
      startDate,
      endDate,
      nationality,
      cursor,
      take,
    }: FilteredUsersArgs,
  ): Promise<UserSearchResult> {
    let findManyArgs = {};

    // Construct the AND filtering
    const AND = [];
    if (contains && contains !== '')
      AND.push({
        name: {
          contains,
          mode: 'insensitive',
        },
      });
    if (startDate)
      AND.push({
        birthdate: {
          gte: startDate,
        },
      });
    if (endDate)
      AND.push({
        birthdate: {
          lte: endDate,
        },
      });
    if (nationality && nationality !== '')
      AND.push({
        nationality: nationality,
      });

    if (AND.length > 0) findManyArgs = { ...findManyArgs, where: { AND } };

    const findManyArgsWithTake: FindManyUserArgs = { ...findManyArgs };

    // Build the cursor positional
    if (take) {
      findManyArgsWithTake.take = take;
      if (cursor) {
        findManyArgsWithTake.cursor = { id: cursor };
        findManyArgsWithTake.skip = 1;
      }
    }

    return Promise.all([
      await this.prismaService.user.findMany(findManyArgsWithTake),
      await this.prismaService.user.count(findManyArgs),
    ]).then(([users, count]) => ({
      users,
      count,
      cursor: users.slice(-1).pop()?.id,
    }));
  }
}
