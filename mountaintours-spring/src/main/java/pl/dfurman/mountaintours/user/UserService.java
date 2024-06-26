package pl.dfurman.mountaintours.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.user.userrepository.JdbcUserRepository;

@Service
public class UserService implements UserDetailsService {
    private final static String USER_NOT_FOUND_MSG = "User with email %s not found";
    private final static String USER_ID_NOT_FOUND_MSG = "User with id %s not found";
    private final JdbcUserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService (JdbcUserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }
    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND_MSG, email)));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND_MSG, email)));
    }

    public ResponseEntity<Integer> singUpUser(User user) {
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        Integer u = userRepository.saveUser(user);
        return ResponseEntity.ok(u);
    }

    public User findById(int id) {
        boolean userExists = userRepository.findById(id).isPresent();

        if (!userExists) {
            throw new IllegalStateException("User not found");
        }
        return userRepository.findById(id).get();
    }

    public User getUserInfoByTourOwnerId(int tourOwnerId) {
        return userRepository.getUserInfoByTourOwnerId(tourOwnerId)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_ID_NOT_FOUND_MSG, tourOwnerId)));
    }
}
