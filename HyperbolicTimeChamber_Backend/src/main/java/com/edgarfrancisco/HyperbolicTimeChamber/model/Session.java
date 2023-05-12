package com.edgarfrancisco.HyperbolicTimeChamber.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double totalTime;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    private Project project;
    private int sessionQuality;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    User sessionUser;

    public Session() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }

    public int getSessionQuality() { return sessionQuality; }

    public void setSessionQuality(int sessionQuality) { this.sessionQuality = sessionQuality; }

    public User getSessionUser() {
        return sessionUser;
    }

    public void setSessionUser(User sessionUser) {
        this.sessionUser = sessionUser;
    }
}
