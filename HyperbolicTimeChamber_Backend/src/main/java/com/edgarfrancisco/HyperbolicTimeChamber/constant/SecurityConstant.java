package com.edgarfrancisco.HyperbolicTimeChamber.constant;

public class SecurityConstant {

    public static final long EXPIRATION_TIME = 432_000_000L; // == 5 DAYS
    public static final String EDGAR_FRANCISCO = "edgarfrancisco";
    public static final String HYPERBOIC_TIME_CHAMBER = "HyperbolicTimeChamber";
    public static final String AUTHORITIES = "authorities";
    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String[] PUBLIC_URLS = { "/user/login", "/user/register", "/user/image/**" };
    public static final String JWT_TOKEN_HEADER = "Jwt-Token";
}
