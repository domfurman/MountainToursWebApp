package pl.dfurman.mountaintours.map.maprepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.SqlValue;
import org.springframework.stereotype.Repository;
import pl.dfurman.mountaintours.map.Map;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class JdbcMapRepository implements MapRepository{

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Override
    public int saveMap(Map map) {

        return jdbcTemplate.update("""
            INSERT INTO tours (startplace, endplace, waypoints)
            VALUES (?, ?, ?)
        """,
                map.getStartPlace(), map.getEndPlace(), new SqlValue() {
                    @Override
                    public void setValue(PreparedStatement ps, int paramIndex) throws SQLException {
                        Connection conn = ps.getConnection();
                        Double[][] waypointArray = map.getWaypoints().stream()
                                .map(arr -> Arrays.stream(arr).boxed().toArray(Double[]::new))
                                .toArray(Double[][]::new);
                        java.sql.Array sqlArray = conn.createArrayOf("double precision", waypointArray);
                        ps.setArray(paramIndex, sqlArray);
                    }

                    @Override
                    public void cleanup() {
                    }
                }
        );
    }

    @Override
    public List<Map> findAll() throws SQLException {
        List<Map> maps = new ArrayList<>();
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM tours");
            ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map map = new Map();

                Array startPlaceArray = rs.getArray("startplace");
                Array endPlaceArray = rs.getArray("endplace");
                Array waypointsArray = rs.getArray("waypoints");

                if (startPlaceArray != null) {
                    map.setStartPlace(convertToPrimitive((Double[]) startPlaceArray.getArray()));
                }
                if (endPlaceArray != null) {
                    map.setEndPlace(convertToPrimitive((Double[]) endPlaceArray.getArray()));
                }
                if (waypointsArray != null) {
                    Double[][] waypoints = (Double[][]) waypointsArray.getArray();
                    List<double[]> waypointList = Arrays.stream(waypoints)
                            .map(array -> convertToPrimitive(array))
                            .collect(Collectors.toList());
                    map.setWaypoints(waypointList);
                }
                maps.add(map);
            }
        }
        catch (SQLException e) {

        }
        return maps;
    }

    private double[] convertToPrimitive(Double[] array) {
        return Arrays.stream(array)
                .mapToDouble(Double::doubleValue)
                .toArray();
    }
}
