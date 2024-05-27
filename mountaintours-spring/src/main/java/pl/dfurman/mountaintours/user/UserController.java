package pl.dfurman.mountaintours.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/user/20")
    public User userJohn() {
        return userService.findByEmail("johncena@gmail.com");
    }
    @PostMapping(value = "/",
    consumes = {"application/json"})
    public ResponseEntity<?> login(@RequestBody User user) {
        System.out.println(user);
        User userDetails = userService.findByEmail(user.getEmail());
        if (user.getPassword().equals(userDetails.getPassword())) {
            return ResponseEntity.ok(user);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "http://localhost:4200");
//        return (ResponseEntity<?>) ResponseEntity.internalServerError();
        return ResponseEntity.ok().headers(headers).body(user);
    }


    @GetMapping("/api/currentuser")
    public UserDetails userInfo(String email) {
        return userService.loadUserByUsername(email);
    }

    @GetMapping("/api/principaluser")
    public Principal user(Principal user) {
        return user;
    }

//    @GetMapping(path = "api/user-by-tour-id/{tourId}")
//    public ResponseEntity<User> getUserInfoByTicketId(@PathVariable("tourId") int tourId) {
//        User user = userService.getUserInfoByTourId(tourId);
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }
    @GetMapping(path = "/api/user-by-tour-owner-id/{tourOwnerId}")
    public User getUserInfoByTicketId(@PathVariable("tourOwnerId") int tourOwnerId) {
        return userService.getUserInfoByTourOwnerId(tourOwnerId);
    }
}
