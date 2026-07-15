package com.Farm.NASMS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication

public class NasmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(NasmsApplication.class, args);
	}
}
