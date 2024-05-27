package pl.dfurman.mountaintours.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200")
public class MapController {
    private final MapService mapService;

    @Autowired
    public MapController(MapService mapService) {
        this.mapService = mapService;
    }

    @PostMapping(path = "api/save-map")
    public ResponseEntity<Integer> saveMap(@RequestBody MapRequest mapRequest) throws SQLException{
        return mapService.saveMap(mapRequest);
    }

    @GetMapping(path = "api/find-all-maps")
    public List<Map> findAllMaps() throws SQLException {
        return mapService.findAll();
    }

}
