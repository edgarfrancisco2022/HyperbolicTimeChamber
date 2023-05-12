package com.edgarfrancisco.HyperbolicTimeChamber.service;

import com.edgarfrancisco.HyperbolicTimeChamber.model.Project;
import com.edgarfrancisco.HyperbolicTimeChamber.model.Session;
import com.edgarfrancisco.HyperbolicTimeChamber.model.User;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.ProjectRepository;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.SessionRepository;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    @Autowired
    SessionRepository sessionRepository;
    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    UserRepository userRepository;

    @Transactional
    public Session addNewSession(Session session) {

        Project project = projectRepository.findById(session.getProject().getId()).get();
        User user = userRepository.findById(session.getSessionUser().getId()).get();

        project.setTotalTime(project.getTotalTime() + session.getTotalTime());
        project.setTotalSessions(project.getTotalSessions() + 1);
        project.setProjectUser(user);

        project.addSession(session);
        session.setProject(project);
        session.setSessionUser(user);

        user.addSession(session);
        user.addProject(project);

        //userRepository.save(user);
        Session savedSession = sessionRepository.save(session);

        return savedSession;
    }

    public String deleteSession(Session session) {
        Project project = projectRepository.findById(session.getProject().getId()).get();
        project.setTotalTime(project.getTotalTime() - session.getTotalTime());
        project.setTotalSessions(project.getTotalSessions() - 1);
        session.setProject(null);
        sessionRepository.delete(session);
        projectRepository.save(project);
        return "Session deleted successfully";
    }

    // Fixes infinite recursion problem when returning a JSON Session object
    public Session createSessionResponse(Session session) {
        session.setProject(null);
        session.setSessionUser(null);
        return session;
    }
}
