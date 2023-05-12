package com.edgarfrancisco.HyperbolicTimeChamber;

import com.edgarfrancisco.HyperbolicTimeChamber.model.User;
import com.edgarfrancisco.HyperbolicTimeChamber.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserTest {
    @Autowired
    UserRepository userRepository;

    @Test
    public void createUser() {
        User user = new User();
        user.setFirstName("User 1");
        userRepository.save(user);
    }
}
