package pl.dfurman.mountaintours.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
    allowedHeaders = {"x-auth-token", "x-requested-with", "x-xsrf-token"})
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*@GetMapping("/api/user/20")
    public Map<String, Object> userInfo() {
        User user = userService.findById(20);
        Map<String, Object> userInfo = new HashMap<String, Object>();
        userInfo.put("id", user.getId());
        userInfo.put("firstName", user.getFirstName());
        return userInfo;
    }*/

    @GetMapping("/api/user/20")
    public User userInfo() {
        return userService.findById(20);
    }

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }
}
