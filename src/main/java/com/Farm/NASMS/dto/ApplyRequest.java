package com.Farm.NASMS.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplyRequest(
        @NotNull String loanProductId,        // maps to your LoanPackage ID
        @NotBlank String loanName,          // for display / logging
        @NotNull @Min(1000) Long amount,    // KES amount requested
        @NotBlank String purpose            // free-text description
) {}
