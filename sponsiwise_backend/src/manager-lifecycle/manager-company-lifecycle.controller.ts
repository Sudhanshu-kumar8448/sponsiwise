import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard, RoleGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import type { JwtPayloadWithClaims } from '../auth/interfaces';
import { ManagerCompanyLifecycleService } from './manager-company-lifecycle.service';

@Controller('manager/companies')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.MANAGER)
export class ManagerCompanyLifecycleController {
  constructor(private readonly lifecycleService: ManagerCompanyLifecycleService) {}

  /**
   * GET /manager/companies/:id/lifecycle
   * Returns full lifecycle view of a company: creation, verification, emails, audit logs
   */
  @Get(':id/lifecycle')
  async getCompanyLifecycle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: JwtPayloadWithClaims,
  ) {
    return this.lifecycleService.getCompanyLifecycle(user.tenant_id, id);
  }
}
