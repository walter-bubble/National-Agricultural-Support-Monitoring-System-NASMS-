package com.Farm.NASMS.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplyRequest(
        @NotBlank String loanProductId,      // LoanPackage.loanCode (String PK)
        @NotBlank String loanName,
        @NotNull @Min(1000) Long amount,
        @NotBlank String purpose
) {}
