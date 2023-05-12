package com.edgarfrancisco.HyperbolicTimeChamber.service;

import com.edgarfrancisco.HyperbolicTimeChamber.exception.domain.ProjectAlreadyExistsException;
import com.edgarfrancisco.HyperbolicTimeChamber.model.Project;
import com.edgarfrancisco.HyperbolicTimeChamber.model.Session;
import com.edgarfrancisco.HyperbolicTimeChamber.model.User;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.ProjectRepository;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.edgarfrancisco.HyperbolicTimeChamber.constant.ProjectConstant.PROJECT_ALREADY_EXISTS;

@Service
public class ProjectService {

    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    UserRepository userRepository;

    public List<Project> getAllProjets(User user) {

        List<Project> projects = projectRepository.getAllProjects(user.getId());
        List<Project> projectsResponse = createGetAllProjectsResponse(projects);
        return projectsResponse;
    }
    public Project createNewProject(Project project) throws ProjectAlreadyExistsException {
        // Check if project exists
        //validateNewProjectName(project);
        Project savedProject = persistNewProjectToDB(project);
        Project returnedProject = createProjectResponse(savedProject);
        return returnedProject;
    }

    @Transactional
    public String deleteProject(Project project) {
        projectRepository.delete(project);
        return "Project deleted successfully.";
    }

    private void validateNewProjectName(Project project) throws ProjectAlreadyExistsException {
        boolean projectAlreadyExists = false;
        List<Project> projects = userRepository.findById(project.getProjectUser().getId()).get().getProjects();
        for (Project p : projects) {
            if (p.getName() == project.getName()) {
                projectAlreadyExists = true;
            }
        }

        if (projectAlreadyExists) {
            throw new ProjectAlreadyExistsException(PROJECT_ALREADY_EXISTS);
        }
    }
    @Transactional
    private Project persistNewProjectToDB(Project project) {
        Project newProject = new Project();
        newProject.setName(project.getName());
        newProject.setTotalSessions(0);
        newProject.setTotalTime(0);

        User user = userRepository.findById(project.getProjectUser().getId()).get();

        newProject.setProjectUser(user);
        user.addProject(newProject);

        Project savedProject = projectRepository.save(newProject);

        return savedProject;
    }

    private Project createProjectResponse(Project savedProject) {
        savedProject.setSessions(null);
        savedProject.setProjectUser(null);
        return savedProject;
    }

    private List<Project> createGetAllProjectsResponse(List<Project> projects) {
        projects.forEach(p -> {
            p.setProjectUser(null);
            p.getSessions().forEach(s -> {
                s.setProject(null);
                s.setSessionUser(null);
            });
        });
        System.out.println(projects);
        return projects;
    }

}
