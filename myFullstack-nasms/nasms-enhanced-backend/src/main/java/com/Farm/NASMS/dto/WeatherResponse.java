 package com.Farm.NASMS.dto;

  import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

  @JsonIgnoreProperties(ignoreUnknown = true)
  public class WeatherResponse {

      @JsonProperty("name")
      private String name;

      @JsonProperty("main")
      private Main main;

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

      @JsonIgnoreProperties(ignoreUnknown = true)
      public static class Main {
          @JsonProperty("temp")
          private double temp;

          @JsonProperty("humidity")
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
  }
