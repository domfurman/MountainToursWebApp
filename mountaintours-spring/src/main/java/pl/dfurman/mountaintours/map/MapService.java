package pl.dfurman.mountaintours.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.map.maprepository.JdbcMapRepository;

import java.sql.SQLException;
import java.util.List;

@Service
public class MapService {

    private final JdbcMapRepository mapRepository;

    @Autowired
    public MapService(JdbcMapRepository mapRepository) {
        this.mapRepository = mapRepository;
    }

    public ResponseEntity<Integer> saveMap(MapRequest request) {
        Integer m = mapRepository.saveMap(
                new Map(
                        request.getOwnerId(),
                        request.getStartPlace(),
                        request.getEndPlace(),
                        request.getWaypoints()
                )
        );
        return ResponseEntity.ok(m);
    }

    public List<Map> findAll() throws SQLException {
        return mapRepository.findAll();
    }
}
