package com.edgarfrancisco.HyperbolicTimeChamber.controller;

import com.edgarfrancisco.HyperbolicTimeChamber.dto.HttpResponse;
import com.edgarfrancisco.HyperbolicTimeChamber.exception.domain.ProjectAlreadyExistsException;
import com.edgarfrancisco.HyperbolicTimeChamber.model.Project;
import com.edgarfrancisco.HyperbolicTimeChamber.model.Session;
import com.edgarfrancisco.HyperbolicTimeChamber.model.User;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.ProjectRepository;
import com.edgarfrancisco.HyperbolicTimeChamber.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/project")
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @PostMapping("/get")
    public ResponseEntity<List<Project>> getAllProjects(@RequestBody User user) {
        List<Project> projects = projectService.getAllProjets(user);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @PostMapping("/new")
    public ResponseEntity<Project> createNewProject(@RequestBody Project project) throws ProjectAlreadyExistsException {
        Project returnedProject = projectService.createNewProject(project);
        return new ResponseEntity<>(returnedProject, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<HttpResponse> deleteSession(@RequestBody Project project) {
        String response = projectService.deleteProject(project);
        //HttpResponse httpResponse = new HttpResponse();
        return createHttpResponse(HttpStatus.OK, response);
    }

    private ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {

        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus,
                httpStatus.getReasonPhrase(), message), httpStatus);
    }
}
