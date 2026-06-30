package com.Farm.NASMS.dto;

import jakarta.validation.constraints.NotBlank;

public record WaitlistRequest(
        @NotBlank Long loanProductId,
        @NotBlank String loanName
) {}
