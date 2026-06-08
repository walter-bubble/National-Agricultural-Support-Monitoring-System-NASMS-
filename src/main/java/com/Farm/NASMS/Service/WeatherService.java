package com.Farm.NASMS.Service;

import com.Farm.NASMS.WeatherProperties;
import com.Farm.NASMS.WeatherResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WeatherService {
    private WeatherProperties weatherProperties;
    private RestTemplate restTemplate;
    public WeatherService(WeatherProperties weatherProperties,RestTemplate restTemplate){
        this.weatherProperties=weatherProperties;
        this.restTemplate=restTemplate;
    }
    public WeatherResponse getWeather(String city){
        String url = UriComponentsBuilder.fromUriString(weatherProperties.getBaseUrl())
                .queryParam("q", city)
                .queryParam("appid", weatherProperties.getKey())
                .queryParam("units", weatherProperties.getUnits())
                .toUriString();
        try{
            ResponseEntity<WeatherResponse> response = restTemplate.getForEntity(url, WeatherResponse.class);
            if(response.getBody()==null){
                throw new RuntimeException("Empty response for Weather Api");
            }
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching weather data:"+e.getMessage());
        }
    }


}
