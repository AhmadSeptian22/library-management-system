package com.library.management.security;

import com.library.management.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization = " + authHeader);

        // Kalau tidak ada token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Ambil token setelah "Bearer "
        String token = authHeader.substring(7);
        System.out.println("Token = " + token);
        // Ambil username dari token
        String username = jwtService.extractUsername(token);
        System.out.println("Username = " + username);

        // Jika username valid dan belum login
        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            var user = userRepository.findByUsername(username).orElse(null);

            if (user != null &&
                    jwtService.isTokenValid(token, user.getUsername())) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                Collections.emptyList()
                        );
        System.out.println("User ditemukan = " + user.getUsername());
        System.out.println("Token Valid = " + jwtService.isTokenValid(token, user.getUsername()));

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
                        System.out.println("Authentication berhasil diset.");
            }
        }

        filterChain.doFilter(request, response);
    }
}   