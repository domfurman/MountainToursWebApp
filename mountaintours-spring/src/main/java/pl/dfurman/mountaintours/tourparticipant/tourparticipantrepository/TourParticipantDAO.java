package pl.dfurman.mountaintours.tourparticipant.tourparticipantrepository;

import java.sql.SQLException;

public interface TourParticipantDAO {
    int addParticipant(Long tourId, Long participantId) throws SQLException;

    int getNumberOfParticipantsForTour(Long tourId) throws SQLException;

    boolean isParticipant(Long tourId, Long participantId) throws SQLException;

    int resignFromTour(Long tourId, Long participantId) throws SQLException;
}
