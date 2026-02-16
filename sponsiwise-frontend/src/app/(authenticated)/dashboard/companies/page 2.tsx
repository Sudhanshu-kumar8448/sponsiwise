import CompanyVerificationList from "@/components/manager/CompanyVerificationList";

interface CompaniesPageProps {
  searchParams: Promise<{
    page?: string;
    verification_status?: string;
    search?: string;
  }>;
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const params = await searchParams;
  return <CompanyVerificationList searchParams={params} />;
}
