import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchBrowsableEventById } from "@/lib/sponsor-api";
import ProposalForm from "./ProposalForm";

interface NewProposalPageProps {
  searchParams: Promise<{ event_id?: string }>;
}

/**
 * Server Component wrapper for the proposal creation form.
 *
 * 1. Reads `event_id` from query params.
 * 2. Fetches the event server-side to display its name.
 * 3. Renders the Client Component form.
 *
 * If no event_id is provided, redirects to the events list.
 */
export default async function NewProposalPage({
  searchParams,
}: NewProposalPageProps) {
  const params = await searchParams;
  const eventId = params.event_id;

  if (!eventId) {
    redirect("/dashboard/events");
  }

  let eventTitle = "Unknown event";
  try {
    const event = await fetchBrowsableEventById(eventId);
    eventTitle = event.title;
  } catch {
    // Event not found — show form anyway with generic title,
    // the server action will validate the event_id.
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/dashboard/events/${eventId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Back to event
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Proposal</h1>
        <p className="mt-1 text-sm text-gray-600">
          Submit a sponsorship proposal for this event.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <ProposalForm eventId={eventId} eventTitle={eventTitle} />
      </div>
    </div>
  );
}
