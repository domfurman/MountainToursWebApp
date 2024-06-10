package pl.dfurman.mountaintours.user.userrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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
        List<User> users = jdbcTemplate.query("""
                    SELECT DISTINCT u.* FROM users u JOIN tours t ON u.id = t.owner_id WHERE owner_id = ?;
                """, BeanPropertyRowMapper.newInstance(User.class), tourOwnerId);
        if (users.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(users.get(0));
        }
    }

    @Override
    public boolean existsById(Long userId) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE id = ?",
                new Object[]{userId}, Integer.class);
        return count != null && count > 0;
    }
}
