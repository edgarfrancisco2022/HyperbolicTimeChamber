package com.edgarfrancisco.HyperbolicTimeChamber.repository;

import com.edgarfrancisco.HyperbolicTimeChamber.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByName(String projectName);

    @Query(value = "SELECT * FROM project WHERE project_user_id = :user_id", nativeQuery = true)
    List<Project> getAllProjects(Long user_id);
}
