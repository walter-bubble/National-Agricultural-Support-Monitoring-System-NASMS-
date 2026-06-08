package com.Farm.NASMS.Controller;

import com.Farm.NASMS.Service.WeatherService;
import com.Farm.NASMS.WeatherResponse;
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
