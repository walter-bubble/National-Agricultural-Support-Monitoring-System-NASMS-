package com.Farm.NASMS.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherResponse {
    private String name;
            private Main main;
            @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Main{
                private double temp;
                private double humidity;

                public double getTemp() {
                    return temp;
                }

                public void setTemp(double temp) {
                    this.temp = temp;
                }

                public double getHumidity() {
                    return humidity;
                }

                public void setHumidity(double humidity) {
                    this.humidity = humidity;
                }
            }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Main getMain() {
        return main;
    }

    public void setMain(Main main) {
        this.main = main;
    }
}
