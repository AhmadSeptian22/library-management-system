package com.library.management.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // Secret Key minimal 32 karakter
    private static final String SECRET =
            "mySuperSecretKeyForLibraryManagementJWT2026";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Token berlaku 1 hari
    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

    // ===========================
    // Generate JWT
    // ===========================
    public String generateToken(String username){

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

    }

    // ===========================
    // Ambil Username
    // ===========================
    public String extractUsername(String token){

        return getClaims(token).getSubject();

    }

    // ===========================
    // Validasi Token
    // ===========================
    public boolean isTokenValid(String token,String username){

        return extractUsername(token).equals(username)
                && !isTokenExpired(token);

    }

    // ===========================
    // Expired
    // ===========================
    private boolean isTokenExpired(String token){

        return getClaims(token)
                .getExpiration()
                .before(new Date());

    }

    // ===========================
    // Claims
    // ===========================
    private Claims getClaims(String token){

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

}