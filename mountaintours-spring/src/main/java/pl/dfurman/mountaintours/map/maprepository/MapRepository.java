package pl.dfurman.mountaintours.map.maprepository;

import pl.dfurman.mountaintours.map.Map;

import java.sql.SQLException;
import java.util.List;

public interface MapRepository {
    int saveMap(Map map) throws SQLException;

    List<Map> findAll() throws SQLException;

    boolean existsById(Long tourId);

    List<Map> findAllByRoutesByParticipantId(Long participantId) throws SQLException;

    List<Map> findAllRoutesByOwnerId(Long ownerId) throws SQLException;
}
