package pl.dfurman.mountaintours.login;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ListController {

    @GetMapping("/api/list")
    public List<String> getListItems() {
        return List.of("1", "2", "3");
    }
}
