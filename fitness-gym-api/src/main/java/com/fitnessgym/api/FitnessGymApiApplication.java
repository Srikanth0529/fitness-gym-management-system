package com.fitnessgym.api;

import com.fitnessgym.api.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(
        exclude = UserDetailsServiceAutoConfiguration.class
)
@EnableConfigurationProperties(JwtProperties.class)
public class FitnessGymApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                FitnessGymApiApplication.class,
                args
        );
    }
}