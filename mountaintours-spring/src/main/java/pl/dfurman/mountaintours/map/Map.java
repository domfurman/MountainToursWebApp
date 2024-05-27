package pl.dfurman.mountaintours.map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Map {
    private Long tourId;
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

    public Map(Long ownerId, double[] startPlace, double[] endPlace, List<double[]> waypoints) {
        this.ownerId = ownerId;
        this.startPlace = startPlace;
        this.endPlace = endPlace;
        this.waypoints = waypoints;
    }

    public Map(Long ownerId, double[] startPlace, double[] endPlace, List<double[]> waypoints, int length, int duration, String driverStartingPoint, MapDifficulty mapDifficulty, LocalDateTime tourDate, int numberOfSpots, int participationCosts, LocalDateTime creationDate, LocalDateTime expirationDate) {
        this.ownerId = ownerId;
        this.startPlace = startPlace;
        this.endPlace = endPlace;
        this.waypoints = waypoints;
        this.length = length;
        this.duration = duration;
        this.driverStartingPoint = driverStartingPoint;
        this.mapDifficultyLevel = mapDifficulty;
        this.tourDate = tourDate;
        this.numberOfSpots = numberOfSpots;
        this.participationCosts = participationCosts;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
    }
}
