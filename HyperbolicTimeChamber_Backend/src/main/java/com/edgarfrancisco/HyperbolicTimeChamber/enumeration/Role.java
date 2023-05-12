package com.edgarfrancisco.HyperbolicTimeChamber.enumeration;

import static com.edgarfrancisco.HyperbolicTimeChamber.constant.Authority.USER_AUTHORITIES;

public enum Role {

    ROLE_USER(USER_AUTHORITIES); //constructor initializes private field with this value
    private String[] authorities;
    Role(String... authorities) { this.authorities = authorities; }

    public String[] getAuthorities() { return authorities; }
}
