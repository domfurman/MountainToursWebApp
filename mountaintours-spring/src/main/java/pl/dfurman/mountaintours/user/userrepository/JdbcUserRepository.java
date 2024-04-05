package pl.dfurman.mountaintours.user.userrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import pl.dfurman.mountaintours.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public class JdbcUserRepository  implements UserRepository{

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Override
    public List<User> findAllUsers() {
        return jdbcTemplate.query("SELECT * FROM users", BeanPropertyRowMapper.newInstance(User.class));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public int saveUser(User user) {
        return jdbcTemplate.update("""
            INSERT INTO users (firstname, lastname, password, email, user_role, locked, enabled)
            VALUES (?, ?, ?, ?, ?, false, true)
        """,
                user.getFirstName(), user.getLastName(), user.getPassword(), user.getEmail(), user.getUserRole().toString());
    }
}
