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
        /*return Optional.ofNullable(jdbcTemplate.queryForObject("SELECT * FROM users WHERE email = ?",
                BeanPropertyRowMapper.newInstance(User.class), email));*/
        List<User> existingUsers= jdbcTemplate.query("SELECT * FROM users WHERE email = ?",
                BeanPropertyRowMapper.newInstance(User.class), email);
        return existingUsers.isEmpty() ? Optional.empty() : Optional.of(existingUsers.get(0));
    }

    @Override
    public int saveUser(User user) {
        return jdbcTemplate.update("""
            INSERT INTO users (firstname, lastname, password, email, user_role, locked, enabled)
            VALUES (?, ?, ?, ?, ?, false, true)
        """,
                user.getFirstName(), user.getLastName(), user.getPassword(), user.getEmail(), user.getUserRole().toString());
    }

    @Override
    public Optional<User> findById(int id) {
        User user = jdbcTemplate.queryForObject("SELECT * FROM users WHERE id =?",
                BeanPropertyRowMapper.newInstance(User.class), id);
        return Optional.of(user);
    }

    @Override
    public Optional<User> getUserInfoByTourOwnerId(int tourOwnerId) {
        User user = jdbcTemplate.queryForObject("""
                    SELECT u.* FROM users u JOIN tours t ON u.id = t.owner_id WHERE owner_id = ?;
                """, BeanPropertyRowMapper.newInstance(User.class), tourOwnerId);
        return Optional.of(user);
    }
}
