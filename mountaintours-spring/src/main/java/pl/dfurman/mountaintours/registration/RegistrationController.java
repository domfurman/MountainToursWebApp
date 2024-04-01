package pl.dfurman.mountaintours.registration;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping(path = "api/registration")
    public String register(@RequestBody RegistrationRequest request) {
        return registrationService.register(request);
    }
}
