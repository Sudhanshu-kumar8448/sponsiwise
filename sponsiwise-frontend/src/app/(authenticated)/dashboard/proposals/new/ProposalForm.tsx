"use client";

import { useActionState } from "react";
import {
  createProposalAction,
  type CreateProposalState,
} from "../_actions";

interface ProposalFormProps {
  /** Pre-selected event ID (from query param) */
  eventId: string;
  /** Event title for display */
  eventTitle: string;
}

const initialState: CreateProposalState = {
  success: false,
  error: null,
  proposalId: null,
};

/**
 * Client Component — proposal submission form.
 *
 * Uses React 19 `useActionState` to bind to the server action.
 * All actual data mutation happens server-side in _actions.ts.
 */
export default function ProposalForm({
  eventId,
  eventTitle,
}: ProposalFormProps) {
  const [state, formAction, isPending] = useActionState(
    createProposalAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden event_id */}
      <input type="hidden" name="event_id" value={eventId} />

      {/* Event display (read-only) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Event
        </label>
        <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
          {eventTitle}
        </p>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Proposal Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          placeholder="e.g. Gold-tier sponsorship for TechConf 2026"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={5}
          placeholder="Describe what you're offering and what you expect in return…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Amount + Currency */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="amount"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            required
            min={1}
            step="0.01"
            placeholder="5000"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="currency"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="USD"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {isPending ? "Submitting…" : "Submit Proposal"}
        </button>
        <a
          href="/dashboard/events"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
