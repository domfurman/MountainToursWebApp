package pl.dfurman.mountaintours.registration;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.dfurman.mountaintours.dto.ResponseDTO;

@RestController
@AllArgsConstructor
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping(path = "api/registration")
    public ResponseEntity<Integer> register(@RequestBody RegistrationRequest request) {
        return registrationService.register(request);
    }
}
