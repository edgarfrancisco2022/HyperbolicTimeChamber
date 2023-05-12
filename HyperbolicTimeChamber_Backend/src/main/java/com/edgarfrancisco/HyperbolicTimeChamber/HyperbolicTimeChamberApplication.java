package com.edgarfrancisco.HyperbolicTimeChamber;

import com.edgarfrancisco.HyperbolicTimeChamber.security.filter.JwtAccessDeniedHandler;
import com.edgarfrancisco.HyperbolicTimeChamber.security.filter.JwtAuthenticationEntryPoint;
import com.edgarfrancisco.HyperbolicTimeChamber.security.utility.JWTTokenProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@SpringBootApplication
public class HyperbolicTimeChamberApplication {

	public static void main(String[] args) {
		SpringApplication.run(HyperbolicTimeChamberApplication.class, args);
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		//local configuration
		corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
		//aws configuration
//		corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://44.201.211.71"));
		corsConfiguration.setAllowedHeaders(Arrays.asList("Search-Field", "Search-Query", "username", "Origin", "Access-Control-Allow-Origin", "Content-Type",
				"Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));
		corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization",
				"Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		return new CorsFilter(urlBasedCorsConfigurationSource);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Bean
	public JWTTokenProvider jwtTokenProvider() { return new JWTTokenProvider(); }
	@Bean
	public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() { return new JwtAuthenticationEntryPoint(); }
	@Bean
	public JwtAccessDeniedHandler jwtAccessDeniedHandler() { return new JwtAccessDeniedHandler(); }

}
