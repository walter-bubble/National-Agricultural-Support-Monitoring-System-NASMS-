package com.Farm.NASMS.service;

import com.Farm.NASMS.config.WeatherProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class WeatherService {

    private final WeatherProperties props;
    private final RestTemplate       restTemplate;

    public WeatherService(WeatherProperties props, RestTemplate restTemplate) {
        this.props       = props;
        this.restTemplate = restTemplate;
    }

    /**
     * Returns the full OpenWeatherMap JSON as a Map so the frontend
     * receives every field: main, weather[], wind, clouds, rain, sys, etc.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getWeatherRaw(String city) {
        String url = UriComponentsBuilder
                .fromUriString(props.getBaseUrl() + "/weather")
                .queryParam("q",     city)
                .queryParam("appid", props.getKey())
                .queryParam("units", props.getUnits())
                .toUriString();

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        if (response == null) {
            throw new RuntimeException("Empty response from weather API for: " + city);
        }
        return response;
    }
}
