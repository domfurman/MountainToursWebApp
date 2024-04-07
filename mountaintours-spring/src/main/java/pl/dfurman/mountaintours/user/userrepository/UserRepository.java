package pl.dfurman.mountaintours.user.userrepository;

import pl.dfurman.mountaintours.user.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    List<User> findAllUsers();
    Optional<User> findByEmail(String email);
    int saveUser(User user);
    Optional<User> findById(int id);
}
