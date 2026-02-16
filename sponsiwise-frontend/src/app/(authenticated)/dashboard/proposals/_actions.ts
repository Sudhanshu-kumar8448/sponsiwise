"use server";

import { redirect } from "next/navigation";
import { createProposal, withdrawProposal } from "@/lib/sponsor-api";
import type { CreateProposalPayload } from "@/lib/types/sponsor";

// ─── Create proposal action ───────────────────────────────────────────

export interface CreateProposalState {
  success: boolean;
  error: string | null;
  proposalId: string | null;
}

export async function createProposalAction(
  _prev: CreateProposalState,
  formData: FormData,
): Promise<CreateProposalState> {
  const payload: CreateProposalPayload = {
    event_id: formData.get("event_id") as string,
    title: (formData.get("title") as string).trim(),
    description: (formData.get("description") as string).trim(),
    amount: Number(formData.get("amount")),
    currency: (formData.get("currency") as string) || "USD",
  };

  // Basic server-side validation
  if (!payload.event_id) {
    return { success: false, error: "Event is required.", proposalId: null };
  }
  if (!payload.title || payload.title.length < 3) {
    return {
      success: false,
      error: "Title must be at least 3 characters.",
      proposalId: null,
    };
  }
  if (!payload.description || payload.description.length < 10) {
    return {
      success: false,
      error: "Description must be at least 10 characters.",
      proposalId: null,
    };
  }
  if (!payload.amount || payload.amount <= 0) {
    return {
      success: false,
      error: "Amount must be greater than zero.",
      proposalId: null,
    };
  }

  try {
    const proposal = await createProposal(payload);
    // Redirect to the new proposal detail page on success
    redirect(`/dashboard/proposals/${proposal.id}`);
  } catch (err) {
    // redirect() throws a special error so we need to re-throw it
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create proposal. Please try again.",
      proposalId: null,
    };
  }
}

// ─── Withdraw proposal action ──────────────────────────────────────────

export interface WithdrawProposalState {
  success: boolean;
  error: string | null;
}

export async function withdrawProposalAction(
  _prev: WithdrawProposalState,
  formData: FormData,
): Promise<WithdrawProposalState> {
  const id = formData.get("proposal_id") as string;

  if (!id) {
    return { success: false, error: "Proposal ID is required." };
  }

  try {
    await withdrawProposal(id);
    redirect(`/dashboard/proposals/${id}`);
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to withdraw proposal. Please try again.",
    };
  }
}
