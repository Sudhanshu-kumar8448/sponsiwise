import Link from "next/link";
import { fetchVerifiableCompanies } from "@/lib/manager-api";
import type { VerifiableCompany } from "@/lib/types/manager";
import { VerificationStatus } from "@/lib/types/manager";
import { normalizeError } from "@/lib/errors";
import {
  SearchBar,
  FilterTabs,
  ErrorState,
  EmptyState,
  DataTable,
  Pagination,
  VerificationStatusBadge,
} from "@/components/shared";
import type { Column } from "@/components/shared/DataTable";

// ─── Filter tabs ───────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: VerificationStatus.PENDING, label: "Pending" },
  { value: VerificationStatus.VERIFIED, label: "Verified" },
  { value: VerificationStatus.REJECTED, label: "Rejected" },
];

const PAGE_SIZE = 15;

// ─── Main component ────────────────────────────────────────────────────

interface CompanyVerificationListProps {
  searchParams: {
    page?: string;
    verification_status?: string;
    search?: string;
  };
}

export default async function CompanyVerificationList({
  searchParams,
}: CompanyVerificationListProps) {
  const page = Number(searchParams.page) || 1;
  const statusFilter = searchParams.verification_status ?? "";
  const search = searchParams.search;

  let companies: VerifiableCompany[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const res = await fetchVerifiableCompanies({
      page,
      page_size: PAGE_SIZE,
      verification_status: statusFilter || undefined,
      search,
    });
    companies = res.data;
    total = res.total;
  } catch (err) {
    error = normalizeError(err, "Unable to load companies. Please try again later.");
  }

  const hasFilter = !!statusFilter || !!search;

  // Build link helper
  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      verification_status: statusFilter || undefined,
      search,
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return `/dashboard/companies${qs ? `?${qs}` : ""}`;
  }

  // Column definitions
  const columns: Column<VerifiableCompany>[] = [
    {
      key: "name",
      header: "Company",
      render: (c) => (
        <div className="flex items-center gap-3">
          {c.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.logo_url}
              alt={c.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
              {c.name.charAt(0)}
            </span>
          )}
          <Link
            href={`/dashboard/companies/${c.id}`}
            className="text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            {c.name}
          </Link>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (c) => (
        <div>
          <p className="text-sm text-gray-600">{c.owner.name}</p>
          <p className="text-xs text-gray-400">{c.owner.email}</p>
        </div>
      ),
    },
    {
      key: "industry",
      header: "Industry",
      hideOnMobile: true,
      render: (c) => (
        <span className="text-sm text-gray-600">{c.industry ?? "—"}</span>
      ),
    },
    {
      key: "website",
      header: "Website",
      hideOnMobile: true,
      render: (c) =>
        c.website ? (
          <span className="inline-block max-w-[150px] truncate text-sm text-blue-600">
            {c.website.replace(/^https?:\/\//, "")}
          </span>
        ) : (
          <span className="text-sm text-gray-600">—</span>
        ),
    },
    {
      key: "verification_status",
      header: "Status",
      render: (c) => (
        <VerificationStatusBadge status={c.verification_status} />
      ),
    },
    {
      key: "created_at",
      header: "Registered",
      hideOnMobile: true,
      render: (c) => (
        <span className="text-sm text-gray-500">
          {new Date(c.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "lifecycle",
      header: "",
      render: (c) => (
        <Link
          href={`/dashboard/companies/${c.id}/lifecycle`}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          📊 View Lifecycle
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Company Verification
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and verify registered companies.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-4">
        <SearchBar
          defaultValue={search}
          placeholder="Company name or email…"
          color="amber"
          hiddenFields={{
            verification_status: statusFilter || undefined,
          }}
        />

        <div className="flex flex-wrap gap-2">
          <FilterTabs
            tabs={STATUS_TABS}
            activeValue={statusFilter}
            buildHref={(v) =>
              buildHref({ verification_status: v || undefined, page: undefined })
            }
            activeColor="bg-amber-600"
          />
        </div>
      </div>

      {/* Results */}
      {error ? (
        <ErrorState message={error} />
      ) : companies.length === 0 ? (
        <EmptyState
          icon="🏢"
          heading={hasFilter ? "No matching companies" : "No companies to review"}
          description={
            hasFilter
              ? "Try changing filters to see more results."
              : "All companies have been reviewed."
          }
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {companies.length} of {total} compan
            {total !== 1 ? "ies" : "y"}
          </p>

          <DataTable
            columns={columns}
            data={companies}
            rowKey={(c) => c.id}
          />

          <Pagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            buildHref={(p) => buildHref({ page: String(p) })}
            showPageLabel={false}
          />
        </>
      )}
    </div>
  );
}
