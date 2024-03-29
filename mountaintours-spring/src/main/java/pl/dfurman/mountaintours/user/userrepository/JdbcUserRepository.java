package pl.dfurman.mountaintours.user.userrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import pl.dfurman.mountaintours.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public class JdbcUserRepository  implements UserRepository{

    JdbcTemplate jdbcTemplate;
    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.empty();
    }
}
