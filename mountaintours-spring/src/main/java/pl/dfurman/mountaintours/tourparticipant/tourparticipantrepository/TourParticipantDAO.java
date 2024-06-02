package pl.dfurman.mountaintours.tourparticipant.tourparticipantrepository;

import pl.dfurman.mountaintours.user.User;

import java.sql.SQLException;
import java.util.List;

public interface TourParticipantDAO {
    int addParticipant(Long tourId, Long participantId) throws SQLException;

    int getNumberOfParticipantsForTour(Long tourId) throws SQLException;

    boolean isParticipant(Long tourId, Long participantId) throws SQLException;

    int resignFromTour(Long tourId, Long participantId) throws SQLException;

    List<User> getAllParticipantsInfoByTourId(Long tourId) throws SQLException;

    boolean isParticipantInAnyTour(Long participantId) throws SQLException;
}
