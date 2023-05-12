package com.edgarfrancisco.HyperbolicTimeChamber.controller;

import com.edgarfrancisco.HyperbolicTimeChamber.exception.ExceptionHandling;
import com.edgarfrancisco.HyperbolicTimeChamber.exception.domain.EmailAlreadyExistsException;
import com.edgarfrancisco.HyperbolicTimeChamber.exception.domain.UserNotFoundException;
import com.edgarfrancisco.HyperbolicTimeChamber.exception.domain.UsernameAlreadyExistsException;
import com.edgarfrancisco.HyperbolicTimeChamber.model.User;
import com.edgarfrancisco.HyperbolicTimeChamber.security.UserPrincipal;
import com.edgarfrancisco.HyperbolicTimeChamber.security.utility.JWTTokenProvider;
import com.edgarfrancisco.HyperbolicTimeChamber.service.UserService;
import com.edgarfrancisco.HyperbolicTimeChamber.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import static com.edgarfrancisco.HyperbolicTimeChamber.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.OK;
@RestController
@RequestMapping(path = "/user")
public class UserController extends ExceptionHandling {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private JWTTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) throws UserNotFoundException,
            UsernameAlreadyExistsException,
            EmailAlreadyExistsException {

        User newUser = userService.register(user.getFirstName(), user.getLastName(),
                                            user.getUsername(), user.getEmail());
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody User user) {
        authenticate(user.getUsername(), user.getPassword());
        User loginUser = userService.findUserByUsername(user.getUsername());
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        UserResponse userResponse = new UserResponse(loginUser);
        return new ResponseEntity<>(userResponse, jwtHeader, OK);
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    private HttpHeaders getJwtHeader(UserPrincipal user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(user));
        return headers;
    }
}
