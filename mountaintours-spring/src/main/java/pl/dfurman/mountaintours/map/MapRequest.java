package pl.dfurman.mountaintours.map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@EqualsAndHashCode
public class MapRequest {
    private Long ownerId;
    private double[] startPlace;
    private double[] endPlace;
    private List<double[]> waypoints = new ArrayList<>();
    private int length;
    private int duration;
    private String driverStartingPoint;
    private MapDifficulty mapDifficultyLevel;
    private LocalDateTime tourDate;
    private int numberOfSpots;
    private int participationCosts;
    private LocalDateTime creationDate;
    private LocalDateTime expirationDate;
}
