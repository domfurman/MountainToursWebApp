package pl.dfurman.mountaintours.map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Map {
    private double[] startPlace;
    private double[] endPlace;
    private List<double[]> waypoints = new ArrayList<>();

}
