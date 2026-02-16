import {
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import {
  EventStatus,
  VerificationStatus,
  SponsorshipStatus,
  ProposalStatus,
} from '@prisma/client';
import { PrismaService } from '../common/providers/prisma.service';
import type {
  SponsorEventsQueryDto,
  SponsorProposalsQueryDto,
  SponsorSponsorshipsQueryDto,
} from './dto';

/**
 * SponsorService — read-only aggregation layer for sponsor-scoped data.
 *
 * Every method requires a valid companyId (resolved from JWT, never from request).
 * All queries are tenant-scoped AND company-scoped.
 */
@Injectable()
export class SponsorService {
  private readonly logger = new Logger(SponsorService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validate that the caller has a linked company.
   * Throws 403 if companyId is missing from the JWT.
   */
  private assertCompanyId(companyId?: string): asserts companyId is string {
    if (!companyId) {
      throw new ForbiddenException(
        'Sponsor account is not linked to a company',
      );
    }
  }

  // ─── Dashboard Stats ─────────────────────────────────────

  async getDashboardStats(tenantId: string, companyId?: string) {
    this.assertCompanyId(companyId);

    // All proposals belonging to the sponsor's company
    // Proposals link through Sponsorship: Proposal → Sponsorship.companyId
    const [totalProposals, pendingProposals, approvedProposals, rejectedProposals, activeSponsorships] =
      await Promise.all([
        this.prisma.proposal.count({
          where: {
            tenantId,
            isActive: true,
            sponsorship: { companyId },
          },
        }),
        this.prisma.proposal.count({
          where: {
            tenantId,
            isActive: true,
            sponsorship: { companyId },
            status: ProposalStatus.SUBMITTED,
          },
        }),
        this.prisma.proposal.count({
          where: {
            tenantId,
            isActive: true,
            sponsorship: { companyId },
            status: ProposalStatus.APPROVED,
          },
        }),
        this.prisma.proposal.count({
          where: {
            tenantId,
            isActive: true,
            sponsorship: { companyId },
            status: ProposalStatus.REJECTED,
          },
        }),
        this.prisma.sponsorship.count({
          where: {
            tenantId,
            companyId,
            isActive: true,
            status: SponsorshipStatus.ACTIVE,
          },
        }),
      ]);

    // Sum the proposed amounts from active sponsorships
    const totalInvestedResult = await this.prisma.sponsorship.findMany({
      where: {
        tenantId,
        companyId,
        isActive: true,
        status: SponsorshipStatus.ACTIVE,
      },
      select: {
        proposals: {
          where: { status: ProposalStatus.APPROVED, isActive: true },
          select: { proposedAmount: true },
        },
      },
    });

    let totalInvested = 0;
    for (const s of totalInvestedResult) {
      for (const p of s.proposals) {
        totalInvested += p.proposedAmount ? Number(p.proposedAmount) : 0;
      }
    }

    return {
      total_proposals: totalProposals,
      pending_proposals: pendingProposals,
      approved_proposals: approvedProposals,
      total_sponsorships: activeSponsorships,
      total_invested: totalInvested,
      currency: 'USD',
    };
  }

  // ─── Browsable Events ────────────────────────────────────

  async getEvents(
    tenantId: string,
    companyId: string | undefined,
    query: SponsorEventsQueryDto,
  ) {
    this.assertCompanyId(companyId);

    const { page, page_size, search } = query;
    const skip = (page - 1) * page_size;

    // Get event IDs already sponsored by this company
    const existingSponsorships = await this.prisma.sponsorship.findMany({
      where: { companyId, isActive: true },
      select: { eventId: true },
    });
    const sponsoredEventIds = existingSponsorships.map((s) => s.eventId);

    // Build where clause
    const where: any = {
      tenantId,
      isActive: true,
      status: EventStatus.PUBLISHED,
      verificationStatus: VerificationStatus.VERIFIED,
      ...(sponsoredEventIds.length > 0 && {
        id: { notIn: sponsoredEventIds },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: page_size,
        orderBy: { startDate: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          startDate: true,
          endDate: true,
          logoUrl: true,
          organizer: {
            select: { id: true, name: true, logoUrl: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: data.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.id,
        description: e.description || '',
        start_date: e.startDate.toISOString(),
        end_date: e.endDate.toISOString(),
        location: e.location || '',
        image_url: e.logoUrl || null,
        category: '',
        status: 'published',
        organizer: {
          id: e.organizer.id,
          name: e.organizer.name,
          logo_url: e.organizer.logoUrl || null,
        },
        sponsorship_tiers: [],
        tags: [],
      })),
      total,
      page,
      page_size,
    };
  }

  // ─── Proposals ───────────────────────────────────────────

  async getProposals(
    tenantId: string,
    companyId: string | undefined,
    query: SponsorProposalsQueryDto,
  ) {
    this.assertCompanyId(companyId);

    const { page, page_size, status, eventId } = query;
    const skip = (page - 1) * page_size;

    const where: any = {
      tenantId,
      isActive: true,
      sponsorship: {
        companyId,
        ...(eventId && { eventId }),
      },
      ...(status && { status: status.toUpperCase() }),
    };

    const [data, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where,
        skip,
        take: page_size,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          proposedAmount: true,
          proposedTier: true,
          message: true,
          notes: true,
          submittedAt: true,
          reviewedAt: true,
          createdAt: true,
          updatedAt: true,
          sponsorship: {
            select: {
              id: true,
              eventId: true,
              event: {
                select: {
                  id: true,
                  title: true,
                  startDate: true,
                  location: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return {
      data: data.map((p) => ({
        id: p.id,
        event_id: p.sponsorship.eventId,
        sponsorship_id: p.sponsorship.id,
        title: p.proposedTier || '',
        description: p.message || '',
        amount: p.proposedAmount ? Number(p.proposedAmount) : 0,
        currency: 'USD',
        status: p.status.toLowerCase(),
        event: {
          id: p.sponsorship.event.id,
          title: p.sponsorship.event.title,
          slug: p.sponsorship.event.id,
          start_date: p.sponsorship.event.startDate.toISOString(),
          location: p.sponsorship.event.location || '',
        },
        submitted_at: p.submittedAt?.toISOString() || null,
        reviewed_at: p.reviewedAt?.toISOString() || null,
        reviewer_notes: p.notes || null,
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
      })),
      total,
      page,
      page_size,
    };
  }

  // ─── Sponsorships ───────────────────────────────────────

  async getSponsorships(
    tenantId: string,
    companyId: string | undefined,
    query: SponsorSponsorshipsQueryDto,
  ) {
    this.assertCompanyId(companyId);

    const { page, page_size, status } = query;
    const skip = (page - 1) * page_size;

    const where: any = {
      tenantId,
      companyId,
      isActive: true,
      ...(status && { status: status.toUpperCase() }),
    };

    const [data, total] = await Promise.all([
      this.prisma.sponsorship.findMany({
        where,
        skip,
        take: page_size,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          tier: true,
          companyId: true,
          eventId: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              location: true,
            },
          },
          // Sum approved proposal amounts for this sponsorship
          proposals: {
            where: { status: ProposalStatus.APPROVED, isActive: true },
            select: { proposedAmount: true },
          },
        },
      }),
      this.prisma.sponsorship.count({ where }),
    ]);

    return {
      data: data.map((s) => {
        const amount = s.proposals.reduce(
          (sum, p) => sum + (p.proposedAmount ? Number(p.proposedAmount) : 0),
          0,
        );
        return {
          id: s.id,
          event_id: s.eventId,
          company_id: s.companyId,
          tier: s.tier || '',
          amount,
          currency: 'USD',
          status: s.status.toLowerCase(),
          event: {
            id: s.event.id,
            title: s.event.title,
            slug: s.event.id,
            start_date: s.event.startDate.toISOString(),
            location: s.event.location || '',
          },
          created_at: s.createdAt.toISOString(),
        };
      }),
      total,
      page,
      page_size,
    };
  }
}
