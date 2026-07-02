package com.library.management.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI libraryAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Library Management System API")
                        .description("REST API untuk aplikasi manajemen perpustakaan")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Septian Fawzi")
                                .email("tianfawzi@gmail.com")))
                .externalDocs(new ExternalDocumentation()
                        .description("GitHub Repository")
                        .url("https://github.com/AhmadSeptian22/library-management-system"));
    }

}