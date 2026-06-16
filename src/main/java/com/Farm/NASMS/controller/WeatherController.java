package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.WeatherResponse;
import com.Farm.NASMS.service.WeatherService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {
   private WeatherService weatherService;
public WeatherController(WeatherService weatherService){
       this.weatherService=weatherService;
}
@GetMapping
    public WeatherResponse getWeather(@RequestParam String city){
       return weatherService.getWeather(city);
    }
}
