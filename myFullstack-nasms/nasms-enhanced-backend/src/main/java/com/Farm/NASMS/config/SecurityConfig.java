package com.Farm.NASMS.config;

import com.Farm.NASMS.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // CORS preflight — must be open
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public endpoints — no token required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/weather").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/loan-package").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/loan-package/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/seasons").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/market-list/").permitAll()
                .requestMatchers("/actuator/**").permitAll()

                // Admin-only
                .requestMatchers("/api/farmers/").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/farmers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/loan-package").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/loan-package/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/loan-package/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/seasons").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/seasons/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/seasons/**").hasRole("ADMIN")

                // Everything else needs a valid token
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
                "http://localhost",
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5500",
                "http://localhost:8080",
                "http://localhost:8081"
                
        ));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
