package pl.dfurman.mountaintours.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.user.userrepository.JdbcUserRepository;
import pl.dfurman.mountaintours.user.userrepository.UserRepository;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final static String USER_NOT_FOUND_MSG = "User with email %s not found";
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

    public String singUpUser(User user) {
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        userRepository.saveUser(user);
        return "sign up works";
    }

    public User findById(int id) {
        boolean userExists = userRepository.findById(id).isPresent();

        if (!userExists) {
            throw new IllegalStateException("User not found");
        }
        return userRepository.findById(id).get();
    }
}
