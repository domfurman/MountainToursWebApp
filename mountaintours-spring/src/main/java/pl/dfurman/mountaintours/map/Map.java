package pl.dfurman.mountaintours.map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
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
    private MapDifficulty mapDifficulty;
    private LocalDateTime date;
    private int numberOfSpots;
    private LocalDateTime creationDate;
    private LocalDateTime expirationDate;

    public Map(Long ownerId, double[] startPlace, double[] endPlace, List<double[]> waypoints) {
        this.ownerId = ownerId;
        this.startPlace = startPlace;
        this.endPlace = endPlace;
        this.waypoints = waypoints;
    }

    public Map(Long ownerId, double[] startPlace, double[] endPlace, List<double[]> waypoints, MapDifficulty mapDifficulty, LocalDateTime date, int numberOfSpots, LocalDateTime creationDate, LocalDateTime expirationDate) {
        this.ownerId = ownerId;
        this.startPlace = startPlace;
        this.endPlace = endPlace;
        this.waypoints = waypoints;
        this.mapDifficulty = mapDifficulty;
        this.date = date;
        this.numberOfSpots = numberOfSpots;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
    }
}
