package pl.dfurman.mountaintours.map.maprepository;

import pl.dfurman.mountaintours.map.Map;

import java.sql.SQLException;
import java.util.List;

public interface MapRepository {
    int saveMap(Map map);

    List<Map> findAll() throws SQLException;
}