package com.Farm.NASMS.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WaitlistRequest(
        @NotNull Long loanProductId,
        @NotBlank String loanName
) {}
