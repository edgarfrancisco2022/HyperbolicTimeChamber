package com.edgarfrancisco.HyperbolicTimeChamber.repository;

import com.edgarfrancisco.HyperbolicTimeChamber.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
