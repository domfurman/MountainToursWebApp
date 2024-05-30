package pl.dfurman.mountaintours.tourparticipant;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
public class TourParticipantController {
    @Autowired
    TourParticipantService tourParticipantService;

    @PostMapping(path = "/api/tours/{tourId}/participants/{participantId}")
    public ResponseEntity<?> addParticipant(@PathVariable Long tourId, @PathVariable Long participantId) {
        try {
            tourParticipantService.addParticipant(tourId, participantId);
            return ResponseEntity.ok().build();
        } catch (SQLException e) {
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding participant");
        }
    }

    @GetMapping(path ="/api/number-of-participants/tour/{tourId}")
    public int getNumberOfParticipantsForTour(@PathVariable Long tourId) throws SQLException{
        return tourParticipantService.getNumberOfParticipantsForTour(tourId);
    }

    @GetMapping(path = "/api/tour/{tourId}/participant{participantId}")
    public boolean isParticipant(@PathVariable Long tourId, @PathVariable Long participantId) throws SQLException {
        return tourParticipantService.isParticipant(tourId, participantId);
    }

    @DeleteMapping(path = "/api/resign/tour/{tourId}/participant/{participantId}")
    public int resignFromTour(@PathVariable Long tourId, @PathVariable Long participantId) throws SQLException{
        return tourParticipantService.resignFromTour(tourId, participantId);
    }
}
