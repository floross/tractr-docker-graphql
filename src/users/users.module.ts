import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DateScalar } from './common/scalars/date.scalar';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver, DateScalar],
})
export class UsersModule {}
