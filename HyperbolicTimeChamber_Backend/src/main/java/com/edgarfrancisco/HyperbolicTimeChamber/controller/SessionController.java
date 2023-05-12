package com.edgarfrancisco.HyperbolicTimeChamber.controller;

import com.edgarfrancisco.HyperbolicTimeChamber.dto.HttpResponse;
import com.edgarfrancisco.HyperbolicTimeChamber.model.Session;
import com.edgarfrancisco.HyperbolicTimeChamber.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = "/session")
public class SessionController {

    @Autowired
    SessionService sessionService;

    @PostMapping("/new")
    public ResponseEntity<Session> addNewSession(@RequestBody Session session) {
        Session savedSession = sessionService.addNewSession(session);
        Session returnedSession = sessionService.createSessionResponse(savedSession);
        return new ResponseEntity<>(returnedSession, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<HttpResponse> deleteSession(@RequestBody Session session) {
        String response = sessionService.deleteSession(session);
        //HttpResponse httpResponse = new HttpResponse();
        return createHttpResponse(HttpStatus.OK, response);
    }

    private ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {

        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus,
                httpStatus.getReasonPhrase(), message), httpStatus);
    }


}
