import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard, RoleGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import type { JwtPayloadWithClaims } from '../auth/interfaces';
import { SponsorService } from './sponsor.service';
import {
  SponsorEventsQueryDto,
  SponsorProposalsQueryDto,
  SponsorSponsorshipsQueryDto,
} from './dto';

/**
 * SponsorController — authenticated, read-only endpoints for the Sponsor dashboard.
 *
 * All routes:
 *  - Require valid JWT (AuthGuard)
 *  - Require SPONSOR role (RoleGuard + @Roles)
 *  - Resolve company from JWT company_id (NEVER from query/body)
 *  - Scoped to the sponsor's tenant + company
 */
@Controller('sponsor')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SPONSOR)
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  /**
   * GET /sponsor/dashboard/stats
   *
   * Returns aggregate stats for the sponsor dashboard overview.
   */
  @Get('dashboard/stats')
  async getDashboardStats(@CurrentUser() user: JwtPayloadWithClaims) {
    return this.sponsorService.getDashboardStats(
      user.tenant_id,
      user.company_id,
    );
  }

  /**
   * GET /sponsor/events
   *
   * Returns paginated list of events available for sponsorship.
   * Excludes events already sponsored by the caller's company.
   */
  @Get('events')
  async getEvents(
    @Query() query: SponsorEventsQueryDto,
    @CurrentUser() user: JwtPayloadWithClaims,
  ) {
    return this.sponsorService.getEvents(
      user.tenant_id,
      user.company_id,
      query,
    );
  }

  /**
   * GET /sponsor/proposals
   *
   * Returns paginated proposals created by the sponsor's company.
   * Supports optional status and eventId filters.
   */
  @Get('proposals')
  async getProposals(
    @Query() query: SponsorProposalsQueryDto,
    @CurrentUser() user: JwtPayloadWithClaims,
  ) {
    return this.sponsorService.getProposals(
      user.tenant_id,
      user.company_id,
      query,
    );
  }

  /**
   * GET /sponsor/sponsorships
   *
   * Returns paginated sponsorships for the sponsor's company.
   * Supports optional status filter.
   */
  @Get('sponsorships')
  async getSponsorships(
    @Query() query: SponsorSponsorshipsQueryDto,
    @CurrentUser() user: JwtPayloadWithClaims,
  ) {
    return this.sponsorService.getSponsorships(
      user.tenant_id,
      user.company_id,
      query,
    );
  }
}
