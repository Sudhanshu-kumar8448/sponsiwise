import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchVerifiableCompanyById, fetchCompanyLifecycleView } from "@/lib/manager-api";
import { verifyCompanyAction } from "@/app/(authenticated)/dashboard/_manager-actions";
import type { VerifiableCompany, CompanyTimelineEntry } from "@/lib/types/manager";
import { VerificationStatus } from "@/lib/types/manager";
import VerificationStatusBadge from "@/components/shared/VerificationStatusBadge";
import VerifyRejectButtons from "@/components/manager/VerifyRejectButtons";
import CompanyLifecycleTimeline from "@/components/manager/CompanyLifecycleTimeline";

export default async function CompanyVerificationDetail({
  id,
}: {
  id: string;
}) {
  let company: VerifiableCompany;
  let lifecycle: CompanyTimelineEntry[] = [];
  try {
    company = await fetchVerifiableCompanyById(id);
    const lifecycleResp = await fetchCompanyLifecycleView(id);
    lifecycle = lifecycleResp?.timeline ?? [];
  } catch {
    notFound();
  }

  const isPending = company.verification_status === VerificationStatus.PENDING;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/companies"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Back to companies
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {company.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo_url}
              alt={company.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-500">
              {company.name.charAt(0)}
            </span>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {company.name}
              </h1>
              <VerificationStatusBadge
                status={company.verification_status}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{company.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Company lifecycle timeline */}
          <CompanyLifecycleTimeline timeline={lifecycle} />
          {/* Company info */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">
              Company Details
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Industry
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {company.industry ?? "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Website
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {company.website ? (
                    <span className="text-blue-600">
                      {company.website}
                    </span>
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {company.phone ?? "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slug
                </dt>
                <dd className="mt-1 text-sm font-mono text-gray-600">
                  {company.slug}
                </dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          {company.description && (
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
                {company.description}
              </p>
            </div>
          )}

          {/* Verification notes (shown if reviewed) */}
          {company.verification_notes && (
            <div
              className={`rounded-xl p-6 shadow ${company.verification_status === VerificationStatus.VERIFIED
                ? "border border-green-200 bg-green-50"
                : company.verification_status ===
                  VerificationStatus.REJECTED
                  ? "border border-red-200 bg-red-50"
                  : "bg-white"
                }`}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Notes
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm text-gray-700">
                {company.verification_notes}
              </p>
              {company.verified_at && (
                <p className="mt-2 text-xs text-gray-500">
                  Reviewed on{" "}
                  {new Date(company.verified_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}

          {/* Verify / Reject form (only for pending) */}
          {isPending && (
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Verify This Company
              </h2>
              <VerifyRejectButtons
                entityId={company.id}
                entityType="company"
                serverAction={verifyCompanyAction}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Owner details */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Owner
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium text-gray-900">{company.owner.name}</p>
              <p className="text-gray-600">{company.owner.email}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Timeline
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Registered</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(company.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Last updated</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(company.updated_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
              {company.verified_at && (
                <div>
                  <dt className="text-gray-500">Verified</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(company.verified_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
