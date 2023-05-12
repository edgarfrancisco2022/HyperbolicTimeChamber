package com.edgarfrancisco.HyperbolicTimeChamber;

import com.edgarfrancisco.HyperbolicTimeChamber.model.Project;
import com.edgarfrancisco.HyperbolicTimeChamber.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProjectTest {

    @Test
    void createNewProjectJSON() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        Project project = new Project();
        project.setName("secondProject");
        User user = new User();
        user.setId(Long.valueOf(4));
        project.setProjectUser(user);
        String json = mapper.writeValueAsString(project);
        System.out.println(json);
    }

}
