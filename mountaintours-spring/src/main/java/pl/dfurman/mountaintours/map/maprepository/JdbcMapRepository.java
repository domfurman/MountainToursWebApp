package pl.dfurman.mountaintours.map.maprepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.SqlValue;
import org.springframework.stereotype.Repository;
import pl.dfurman.mountaintours.map.Map;
import pl.dfurman.mountaintours.map.MapDifficulty;

import java.sql.*;
import java.time.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class JdbcMapRepository implements MapRepository{

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public int saveMap(Map map) throws SQLException{
        return jdbcTemplate.update("""
            INSERT INTO tours (
            owner_id, 
            startplace, 
            endplace, 
            waypoints, 
            length, 
            duration, 
            driver_starting_point, 
            map_difficulty_level,
            tour_date,
            number_of_spots,
            participation_costs,
            creation_date,
            expiration_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
                map.getOwnerId(),
                map.getStartPlace(),
                map.getEndPlace(),
                new SqlValue() {
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
                },
                map.getLength(),
                map.getDuration(),
                map.getDriverStartingPoint(),
                new SqlValue() {
                    @Override
                    public void setValue(PreparedStatement ps, int paramIndex) throws SQLException {
                        Connection conn = ps.getConnection();
                        MapDifficulty mapDifficulty = map.getMapDifficultyLevel();
                        ps.setObject(8, mapDifficulty.toString());
                    }

                    @Override
                    public void cleanup() {

                    }
                }
                ,
                map.getTourDate(),
                map.getNumberOfSpots(),
                map.getParticipationCosts(),
                map.getCreationDate(),
                map.getExpirationDate()
        );

    }

    @Override
    public List<Map> findAll() throws SQLException {
        List<Map> maps = new ArrayList<>();
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM tours ORDER BY tour_date");
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
//                    Double[][] waypoints = (Double[][]) waypointsArray.getArray();
                    Object[] waypointsObjects = (Object[]) waypointsArray.getArray();
                    if (waypointsObjects != null) {
//                        List<double[]> waypointList = Arrays.stream(waypoints)
//                                .map(array -> convertToPrimitive(array))
//                                .collect(Collectors.toList());
//                        map.setWaypoints(waypointList);
                        List<double[]> waypointList = new ArrayList<>();
                        for (Object waypointObject : waypointsObjects) {
                            if (waypointObject instanceof Object[]) {
                                Double[] waypoint = Arrays.copyOf((Object[]) waypointObject, ((Object[]) waypointObject).length, Double[].class);
                                waypointList.add(convertToPrimitive(waypoint));
                            }
                        }
                        map.setWaypoints(waypointList);
                    }

                }
                map.setOwnerId(rs.getLong("owner_id"));
                map.setTourId(rs.getLong("tour_id"));
                map.setLength(rs.getInt("length"));
                map.setDuration(rs.getInt("duration"));
                map.setDriverStartingPoint(rs.getString("driver_starting_point"));
                map.setMapDifficultyLevel(MapDifficulty.valueOf(rs.getString("map_difficulty_level")));
                map.setTourDate(rs.getTimestamp("tour_date").toLocalDateTime());
                map.setNumberOfSpots(rs.getInt("number_of_spots"));
                map.setParticipationCosts(rs.getInt("participation_costs"));
                map.setCreationDate(rs.getTimestamp("creation_date").toLocalDateTime());
                map.setExpirationDate(rs.getTimestamp("expiration_date").toLocalDateTime());
                maps.add(map);
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return maps;
    }

    private double[] convertToPrimitive(Double[] array) {
//        return Arrays.stream(array)
//                .mapToDouble(Double::doubleValue)
//                .toArray();
        if (array == null) {
            return null;
        }
        return Arrays.stream(array).mapToDouble(o -> o instanceof Double ? (Double) o : Double.NaN).toArray();
    }

    @Override
    public boolean existsById(Long tourId) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tours WHERE tour_id = ?",
                new Object[]{tourId}, Integer.class);
        return count != null && count > 0;
    }

    @Override
    public List<Map> findAllByRoutesByParticipantId(Long participantId) throws SQLException {
        List<Map> maps = new ArrayList<>();
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT t.* FROM tours t JOIN tour_participants tp ON t.tour_id = tp.tour_id JOIN users u ON u.id = tp.participant_id WHERE u.id=? ORDER BY tour_date");
        ) {
            ps.setLong(1, participantId);
            try (ResultSet rs = ps.executeQuery()) {
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
                        Object[] waypointsObjects = (Object[]) waypointsArray.getArray();
                        if (waypointsObjects != null) {
                            List<double[]> waypointList = new ArrayList<>();
                            for (Object waypointObject : waypointsObjects) {
                                if (waypointObject instanceof Object[]) {
                                    Double[] waypoint = Arrays.copyOf((Object[]) waypointObject, ((Object[]) waypointObject).length, Double[].class);
                                    waypointList.add(convertToPrimitive(waypoint));
                                }
                            }
                            map.setWaypoints(waypointList);
                        }
                    }
                    map.setOwnerId(rs.getLong("owner_id"));
                    map.setTourId(rs.getLong("tour_id"));
                    map.setLength(rs.getInt("length"));
                    map.setDuration(rs.getInt("duration"));
                    map.setDriverStartingPoint(rs.getString("driver_starting_point"));
                    map.setMapDifficultyLevel(MapDifficulty.valueOf(rs.getString("map_difficulty_level")));
                    map.setTourDate(rs.getTimestamp("tour_date").toLocalDateTime());
                    map.setNumberOfSpots(rs.getInt("number_of_spots"));
                    map.setParticipationCosts(rs.getInt("participation_costs"));
                    map.setCreationDate(rs.getTimestamp("creation_date").toLocalDateTime());
                    map.setExpirationDate(rs.getTimestamp("expiration_date").toLocalDateTime());
                    maps.add(map);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return maps;
    }

    @Override
    public List<Map> findAllRoutesByOwnerId(Long ownerId) throws SQLException {
        String sql = "SELECT t.* FROM tours t JOIN users u ON t.owner_id = u.id WHERE u.id = ? ORDER BY tour_date";
        List<Map> maps = new ArrayList<>();
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
        ) {
            ps.setLong(1, ownerId);
            try (ResultSet rs = ps.executeQuery()) {
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
                        Object[] waypointsObjects = (Object[]) waypointsArray.getArray();
                        if (waypointsObjects != null) {
                            List<double[]> waypointList = new ArrayList<>();
                            for (Object waypointObject : waypointsObjects) {
                                if (waypointObject instanceof Object[]) {
                                    Double[] waypoint = Arrays.copyOf((Object[]) waypointObject, ((Object[]) waypointObject).length, Double[].class);
                                    waypointList.add(convertToPrimitive(waypoint));
                                }
                            }
                            map.setWaypoints(waypointList);
                        }
                    }
                    map.setOwnerId(rs.getLong("owner_id"));
                    map.setTourId(rs.getLong("tour_id"));
                    map.setLength(rs.getInt("length"));
                    map.setDuration(rs.getInt("duration"));
                    map.setDriverStartingPoint(rs.getString("driver_starting_point"));
                    map.setMapDifficultyLevel(MapDifficulty.valueOf(rs.getString("map_difficulty_level")));
                    map.setTourDate(rs.getTimestamp("tour_date").toLocalDateTime());
                    map.setNumberOfSpots(rs.getInt("number_of_spots"));
                    map.setParticipationCosts(rs.getInt("participation_costs"));
                    map.setCreationDate(rs.getTimestamp("creation_date").toLocalDateTime());
                    map.setExpirationDate(rs.getTimestamp("expiration_date").toLocalDateTime());
                    maps.add(map);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return maps;
    }

    @Override
    public int deleteTour(Long tourId, Long ownerId) throws SQLException {
        return jdbcTemplate.update("""
        DELETE FROM tours WHERE tour_id = ? AND owner_id = ?
        """, tourId, ownerId);
    }

    @Override
    public boolean isOrganizingAnyTour(Long ownerId) throws SQLException {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM tours WHERE owner_id = ?",
                Integer.class,
                ownerId
        );
        return count != null && count > 0;
    }


}
