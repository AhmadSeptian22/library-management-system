package com.library.management.config;

import com.library.management.entity.User;
import com.library.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.count() == 0) {

            User admin = User.builder()
                    .username("fawzi")
                    .password(passwordEncoder.encode("fawzi11122"))
                    .build();

            userRepository.save(admin);

            System.out.println("====================================");
            System.out.println("ADMIN BERHASIL DIBUAT");
            System.out.println("username : fawzi");
            System.out.println("password : fawzi11122");
            System.out.println("====================================");
        }

    }
}