package com.edgarfrancisco.HyperbolicTimeChamber.security.utility;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.edgarfrancisco.HyperbolicTimeChamber.security.UserPrincipal;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static com.edgarfrancisco.HyperbolicTimeChamber.constant.SecurityConstant.*;
import static java.util.Arrays.stream;

/*
    All security related source code based on the Udemy course
    JSON Web Token (JWT) with Spring Security And Angular
    https://www.udemy.com/course/jwt-springsecurity-angular/
*/
public class JWTTokenProvider {
    @Value("${jwt.secret}")
    private String secret;

    /******************************************************/
    /********** if user does not have a token *************/
    /******************************************************/

    /* creates JWT token with info: issuer, audience, date-issued, username, authorities, expiration-date */
    public String generateJwtToken(UserPrincipal userPrincipal) {

        String[] claims = getClaimsFromUser(userPrincipal);

        return JWT.create()
                .withIssuer(EDGAR_FRANCISCO)
                .withAudience(HYPERBOIC_TIME_CHAMBER)
                .withIssuedAt(new Date())
                .withSubject(userPrincipal.getUsername())
                .withArrayClaim(AUTHORITIES, claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(secret.getBytes()));
    }

    /* converts list of GrantedAuthority to a String[] - it contains the user authorities  */
    private String[] getClaimsFromUser(UserPrincipal user) {
        List<String> authorities = new ArrayList<>();

        for (GrantedAuthority grantedAuthority : user.getAuthorities()) {
            authorities.add(grantedAuthority.getAuthority());
        }
        return authorities.toArray(new String[0]);
    }


    /********************************************/
    /********** if user has a token *************/
    /********************************************/

    public String getSubject(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token).getSubject();
    }

    /*  1. creates verifier,
        2. decodes,
        3. converts from String[] to List<GrantedAuthority> */
    public List<GrantedAuthority> getAuthorities(String token) {
        String[] claims = getClaimsFromToken(token);
        return stream(claims).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    /* Authentication is an interface that specifies the type of authentication.
       The UsernamePasswordAuthenticationToken implementation specifies that the user wants to authenticate
       using a username and password. */
    public Authentication getAuthentication(String username, List<GrantedAuthority> authorities,
                                            HttpServletRequest request) {

        UsernamePasswordAuthenticationToken userPasswordAuthToken =
                new UsernamePasswordAuthenticationToken(username, null, authorities);

        userPasswordAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        return userPasswordAuthToken;
    }

    /* checks that token is not expired */
    public boolean isTokenValid(String username, String token) {
        JWTVerifier verifier = getJWTVerifier();
        return StringUtils.isNotEmpty(username) && !isTokenExpired(verifier, token);
    }

    private boolean isTokenExpired(JWTVerifier verifier, String token) {
        Date expiration = verifier.verify(token).getExpiresAt();
        return expiration.before(new Date());
    }

    /* Uses JWTVerifier to decode token and get the user's authorities */
    private String[] getClaimsFromToken(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token).getClaim(AUTHORITIES).asArray(String.class);
    }

    /* Creates JWTVerfier using the secret stored in application.properties */
    private JWTVerifier getJWTVerifier() {
        JWTVerifier verifier;
        try {
            Algorithm algorithm = HMAC512(secret);
            verifier = JWT.require(algorithm).withIssuer(EDGAR_FRANCISCO).build();
        } catch(JWTVerificationException exception) {
            throw new JWTVerificationException(TOKEN_CANNOT_BE_VERIFIED);
        }
        return verifier;
    }
}
