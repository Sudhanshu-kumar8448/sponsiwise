import { Module } from '@nestjs/common';
import { ManagerLifecycleController } from './manager-lifecycle.controller';
import { ManagerLifecycleService } from './manager-lifecycle.service';
import { ManagerCompanyLifecycleController } from './manager-company-lifecycle.controller';
import { ManagerCompanyLifecycleService } from './manager-company-lifecycle.service';
import { PrismaService } from '../common/providers/prisma.service';

/**
 * ManagerLifecycleModule — event & company lifecycle dashboard for managers.
 *
 * Provides:
 *  - GET /manager/events/:id/lifecycle
 *  - GET /manager/companies/:id/lifecycle
 *
 * Uses PrismaService directly for cross-entity aggregation queries.
 */
@Module({
  controllers: [ManagerLifecycleController, ManagerCompanyLifecycleController],
  providers: [ManagerLifecycleService, ManagerCompanyLifecycleService, PrismaService],
})
export class ManagerLifecycleModule {}
