import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/providers/prisma.service';

export type CompanyTimelineType =
  | 'COMPANY_CREATED'
  | 'COMPANY_VERIFIED'
  | 'COMPANY_REJECTED'
  | 'EMAIL_SENT'
  | 'EMAIL_FAILED'
  | 'AUDIT_LOG';

export interface CompanyTimelineEntry {
  type: CompanyTimelineType;
  entityType: string;
  entityId: string;
  actorId?: string;
  actorRole?: string;
  status?: string;
  recipient?: string;
  subject?: string;
  description?: string;
  timestamp: Date;
}

export interface CompanyLifecycleProgress {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
}

export interface CompanyLifecycleResponse {
  company: {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    website: string | null;
    logoUrl: string | null;
    verificationStatus: string;
    createdAt: Date;
    updatedAt: Date;
    owner: {
      id: string;
      email: string;
    };
  };
  progress: CompanyLifecycleProgress;
  timeline: CompanyTimelineEntry[];
}

@Injectable()
export class ManagerCompanyLifecycleService {
  constructor(private readonly prisma: PrismaService) { }

  async getCompanyLifecycle(tenantId: string, companyId: string): Promise<CompanyLifecycleResponse> {
    // 1. Fetch company
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        website: true,
        logoUrl: true,
        verificationStatus: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: { id: true, email: true },
          take: 1,
        },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    const owner = company.users[0] || { id: '', email: '' };

    // 2. Fetch audit logs
    const auditLogs = await this.prisma.auditLog.findMany({
      where: {
        tenantId,
        entityType: 'Company',
        entityId: companyId,
      },
      orderBy: { createdAt: 'asc' },
    });

    // 3. Fetch email logs
    const emailLogs = await this.prisma.emailLog.findMany({
      where: {
        tenantId,
        entityType: 'Company',
        entityId: companyId,
      },
      orderBy: { createdAt: 'asc' },
    });

    // 4. Build timeline
    const timeline: CompanyTimelineEntry[] = [];
    timeline.push({
      type: 'COMPANY_CREATED',
      entityType: 'Company',
      entityId: company.id,
      description: `Company "${company.name}" was created`,
      timestamp: company.createdAt,
    });
    for (const log of auditLogs) {
      const timelineType = this.mapAuditActionToTimelineType(log.action);
      if (timelineType) {
        timeline.push({
          type: timelineType,
          entityType: log.entityType,
          entityId: log.entityId,
          actorId: log.actorId,
          actorRole: log.actorRole,
          status: this.extractStatusFromMetadata(log.metadata),
          description: this.describeAuditAction(log.action, log.entityType, log.entityId),
          timestamp: log.createdAt,
        });
      }
    }
    for (const email of emailLogs) {
      timeline.push({
        type: email.status === 'SENT' ? 'EMAIL_SENT' : 'EMAIL_FAILED',
        entityType: email.entityType ?? 'Email',
        entityId: email.entityId ?? email.id,
        status: email.status,
        recipient: email.recipient,
        subject: email.subject,
        description:
          email.status === 'SENT'
            ? `Email "${email.subject}" sent to ${email.recipient}`
            : `Email "${email.subject}" to ${email.recipient} failed: ${email.errorMessage ?? 'Unknown error'}`,
        timestamp: email.createdAt,
      });
    }
    // Deduplicate
    const deduped = this.deduplicateTimeline(timeline);
    deduped.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // 5. Compute progress
    const progress = this.computeProgress(company, emailLogs);

    return {
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        description: company.description,
        website: company.website,
        logoUrl: company.logoUrl,
        verificationStatus: company.verificationStatus,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        owner,
      },
      progress,
      timeline: deduped,
    };
  }

  private mapAuditActionToTimelineType(action: string): CompanyTimelineType | null {
    const map: Record<string, CompanyTimelineType> = {
      'company.verified': 'COMPANY_VERIFIED',
      'company.rejected': 'COMPANY_REJECTED',
    };
    return map[action] ?? null;
  }
  private extractStatusFromMetadata(metadata: unknown): string | undefined {
    if (metadata && typeof metadata === 'object' && metadata !== null) {
      const m = metadata as Record<string, unknown>;
      if (typeof m.newStatus === 'string') return m.newStatus;
      if (typeof m.status === 'string') return m.status;
    }
    return undefined;
  }
  private describeAuditAction(action: string, entityType: string, entityId: string): string {
    const shortId = entityId.slice(0, 8);
    const descriptions: Record<string, string> = {
      'company.verified': `Company ${shortId}… was verified`,
      'company.rejected': `Company ${shortId}… was rejected`,
    };
    return descriptions[action] ?? `${entityType} ${shortId}… — ${action}`;
  }
  private deduplicateTimeline(entries: CompanyTimelineEntry[]): CompanyTimelineEntry[] {
    const seen = new Set<string>();
    return entries.filter((entry) => {
      const ts = Math.floor(entry.timestamp.getTime() / 1000);
      const key = `${entry.type}:${entry.entityId}:${ts}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  private computeProgress(company: any, emailLogs: any[]): CompanyLifecycleProgress {
    let totalSteps = 0;
    let completedSteps = 0;
    // Step 1: Company created
    totalSteps += 1;
    completedSteps += 1;
    // Step 2: Company verification
    totalSteps += 1;
    if (company.verificationStatus === 'VERIFIED' || company.verificationStatus === 'REJECTED') {
      completedSteps += 1;
    }
    // Steps for emails
    for (const email of emailLogs) {
      totalSteps += 1;
      if (email.status === 'SENT') {
        completedSteps += 1;
      }
    }
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    return { totalSteps, completedSteps, percentage };
  }
}