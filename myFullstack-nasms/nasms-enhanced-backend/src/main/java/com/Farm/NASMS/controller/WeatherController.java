package com.Farm.NASMS.controller;

import com.Farm.NASMS.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    /**
     * GET /api/weather?city=Nairobi
     * Returns the raw OpenWeatherMap JSON structure so the frontend
     * can access main, weather[], wind, clouds, rain, sys, etc.
     */
    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam String city) {
        try {
            Object data = weatherService.getWeatherRaw(city);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(502).body(
                    java.util.Map.of("message", "Weather service unavailable: " + e.getMessage())
            );
        }
    }
}
