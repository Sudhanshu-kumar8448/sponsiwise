import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogRepository } from './audit-log.repository';
import { PrismaService } from '../common/providers';

@Module({
  providers: [AuditLogService, AuditLogRepository, PrismaService],
  exports: [AuditLogService],
})
export class AuditLogsModule {}
