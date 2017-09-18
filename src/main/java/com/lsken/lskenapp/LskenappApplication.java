package com.lsken.lskenapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class LskenappApplication {

	public static void main(String[] args) {
		SpringApplication.run(LskenappApplication.class, args);
	}
	@GetMapping("/")
	public String home(String[] args) {
		return "hello world!!!";
	}
}
