package pl.dfurman.mountaintours.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.map.maprepository.JdbcMapRepository;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MapService {

    private final JdbcMapRepository mapRepository;

    @Autowired
    public MapService(JdbcMapRepository mapRepository) {
        this.mapRepository = mapRepository;
    }

    public ResponseEntity<Integer> saveMap(MapRequest request) throws SQLException {
        LocalDateTime creationDate = LocalDateTime.now();
        Integer m = mapRepository.saveMap(
                new Map(
                        request.getOwnerId(),
                        request.getStartPlace(),
                        request.getEndPlace(),
                        request.getWaypoints(),
                        request.getLength(),
                        request.getDuration(),
                        request.getDriverStartingPoint(),
                        request.getMapDifficultyLevel(),
                        request.getTourDate(),
                        request.getNumberOfSpots(),
                        request.getParticipationCosts(),
                        creationDate,
                        request.getTourDate().minusDays(3)
                )
        );
        return ResponseEntity.ok(m);
    }

    public List<Map> findAll() throws SQLException {
        return mapRepository.findAll();
    }
}
