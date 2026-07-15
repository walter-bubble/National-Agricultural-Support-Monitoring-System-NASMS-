package com.Farm.NASMS.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Basic integration test for the rate limiting filter.
 * Sends enough requests to exceed the limit and expects a 429 response.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class RateLimitingConfigTest {

    @Autowired
    private MockMvc mockMvc;

    private static final int LIMIT = 100; // matches RateLimitingConfig.REQUESTS_PER_MINUTE

    @BeforeEach
    void reset() {
        // No explicit reset needed – each test runs in a fresh Spring context.
    }

    @Test
    void testRateLimiting() throws Exception {
        // First LIMIT requests should succeed (HTTP 200) – we hit a simple endpoint.
        for (int i = 0; i < LIMIT; i++) {
            mockMvc.perform(get("/api/auth/ping"))
                    .andExpect(status().isOk());
        }
        // The next request should be blocked with 429 Too Many Requests.
        mockMvc.perform(get("/api/auth/ping"))
                .andExpect(status().isTooManyRequests());
    }
}
