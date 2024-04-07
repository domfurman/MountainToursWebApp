package pl.dfurman.mountaintours.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
        allowedHeaders = {"x-auth-token", "x-requested-with", "x-xsrf-token", "authorization"})
public class LoginController {

    private final AuthenticationManager authenticationManager;

    @Autowired
    public LoginController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/api/login")
    public void login(@RequestBody LoginRequest loginRequest) {
        /*Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.username(), loginRequest.password());
        Authentication authenticationResponse =
                this.authenticationManager.authenticate(authenticationRequest);
        return new ResponseEntity<Void>(HttpStatus.OK);*/
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password));
    }

    public record LoginRequest(String username, String password) {
    }
}
