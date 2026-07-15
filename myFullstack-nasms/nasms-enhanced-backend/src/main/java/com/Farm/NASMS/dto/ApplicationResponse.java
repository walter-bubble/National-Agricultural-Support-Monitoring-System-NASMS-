// ── ApplicationResponse.java ───────────────────────────────────────────────────
package com.Farm.NASMS.dto;

// What the frontend receives back — maps from your Loan entity.
// Build instances of this in LoanService.getApplicationsByFarmer()
// and LoanService.applyFromFrontend().
public record ApplicationResponse(
        Long id,
        String loanName,
        Long amount,
        String applied,   // formatted date string, e.g. "Mar 01, 2026"
        String status,    // "Approved" | "Under Review" | "Pending"
        String due        // repayment due date, or "—" if not yet set
) {}
