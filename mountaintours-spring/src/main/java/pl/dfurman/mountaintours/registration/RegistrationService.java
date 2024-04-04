package pl.dfurman.mountaintours.registration;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.user.User;
import pl.dfurman.mountaintours.user.UserRole;
import pl.dfurman.mountaintours.user.UserService;

@Service
@AllArgsConstructor
public class RegistrationService {

    private final UserService userService;
    private final EmailValidator emailValidator;

    public String register(RegistrationRequest request) {
        boolean isValid = emailValidator.test(request.getEmail());

        if(!isValid) {
            throw new IllegalStateException("Email not valid");
        }

        return userService.singUpUser(
                new User(
                    request.getFirstName(),
                    request.getLastName(),
                        request.getPassword(),
                    request.getEmail(),
                    UserRole.USER
                    ));
    }
}
