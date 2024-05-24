package pl.dfurman.mountaintours.map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@EqualsAndHashCode
public class MapRequest {
    private Long tourId;
    private Long ownerId;
    private double[] startPlace;
    private double[] endPlace;
    private List<double[]> waypoints = new ArrayList<>();
}
