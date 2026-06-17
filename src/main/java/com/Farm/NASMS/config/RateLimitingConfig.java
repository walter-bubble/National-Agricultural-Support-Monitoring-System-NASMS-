package com.Farm.NASMS.config;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bucket4j.Bandwidth;
import com.bucket4j.Bucket;
import com.bucket4j.Refill;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Simple per‑IP rate limiting using Bucket4j.
 * Limits each client IP to 100 requests per minute (adjustable).
 */
@Configuration
public class RateLimitingConfig {

    private static final int REQUESTS_PER_MINUTE = 100;
    private static final Duration DURATION = Duration.ofMinutes(1);

    // In‑memory bucket store (IP → Bucket)
    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createBucket() {
        Refill refill = Refill.greedy(REQUESTS_PER_MINUTE, DURATION);
        Bandwidth limit = Bandwidth.classic(REQUESTS_PER_MINUTE, refill);
        return Bucket.builder().addLimit(limit).build();
    }

    @Bean
    public OncePerRequestFilter rateLimitingFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, java.io.IOException {
                String clientIp = request.getRemoteAddr();
                Bucket bucket = buckets.computeIfAbsent(clientIp, ip -> createBucket());
                if (bucket.tryConsume(1)) {
                    filterChain.doFilter(request, response);
                } else {
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    response.getWriter().write("Rate limit exceeded. Try again later.");
                }
            }
        };
    }
}
