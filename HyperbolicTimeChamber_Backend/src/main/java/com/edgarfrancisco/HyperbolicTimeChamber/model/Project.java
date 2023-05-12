package com.edgarfrancisco.HyperbolicTimeChamber.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double totalTime;
    private int totalSessions;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
    private List<Session> sessions;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    User projectUser;

    public Project() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }

    public int getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(int totalSessions) {
        this.totalSessions = totalSessions;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public void addSession(Session session) {
        if (this.sessions == null) {
            this.sessions = new ArrayList<>();
        }
        this.sessions.add(session);
    }

    public User getProjectUser() {
        return projectUser;
    }

    public void setProjectUser(User projectUser) {
        this.projectUser = projectUser;
    }
}
