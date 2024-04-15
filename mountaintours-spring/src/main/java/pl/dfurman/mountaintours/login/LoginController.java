package pl.dfurman.mountaintours.login;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.dfurman.mountaintours.dto.ResponseDTO;
import pl.dfurman.mountaintours.dto.UserDTO;
import pl.dfurman.mountaintours.security.session.InMemorySessionRegistry;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {
    private final AuthenticationManager authenticationManager;
    private final InMemorySessionRegistry sessionRegistry;

    @Autowired
    public LoginController(AuthenticationManager authenticationManager, InMemorySessionRegistry sessionRegistry) {
        this.authenticationManager = authenticationManager;
        this.sessionRegistry = sessionRegistry;
    }

    @PostMapping("/api/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody UserDTO user) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                user.getUsername(),
                user.getPassword()));

        String sessionId = sessionRegistry.registerSession(user.getUsername());
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setSessionId(sessionId);

        return ResponseEntity.ok(responseDTO);
    }
}
