package pl.dfurman.mountaintours.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
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

    @GetMapping(path = "api/routes-by-participant/{participantId}")
    public List<Map> findAllByRoutesByParticipantId(@PathVariable Long participantId) throws SQLException {
        return mapService.findAllByRoutesByParticipantId(participantId);
    }

    @GetMapping(path = "api/routes-by-owner/{ownerId}")
    public List<Map> findAllRoutesByOwnerId(@PathVariable Long ownerId) throws SQLException {
        return mapService.findAllRoutesByOwnerId(ownerId);
    }

    @DeleteMapping(path = "api/delete/tour/{tourId}/owner/{ownerId}")
    public int deleteTour(@PathVariable Long tourId,@PathVariable Long ownerId) throws SQLException {
        return mapService.deleteTour(tourId, ownerId);
    }

    @GetMapping(path = "api/map-difficulties")
    public MapDifficulty[] getMapDifficulties() {
        return MapDifficulty.values();
    }

    @GetMapping(path = "api/is-organizing-any-tour/owner/{ownerId}")
    public boolean isOrganizingAnyTour(@PathVariable Long ownerId) throws SQLException {
        return mapService.isOrganizingAnyTour(ownerId);
    }

}
