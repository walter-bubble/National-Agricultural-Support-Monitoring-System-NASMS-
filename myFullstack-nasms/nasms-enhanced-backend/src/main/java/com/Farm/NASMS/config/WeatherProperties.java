package com.Farm.NASMS.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "weather.api")
public class WeatherProperties {
    /** e.g. https://api.openweathermap.org/data/2.5 */
    private String baseUrl;
    private String key;
    private String units = "metric";

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    public String getKey()     { return key; }
    public void setKey(String key) { this.key = key; }
    public String getUnits()   { return units; }
    public void setUnits(String units) { this.units = units; }
}
