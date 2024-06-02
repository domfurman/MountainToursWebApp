package pl.dfurman.mountaintours.tourparticipant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.map.maprepository.JdbcMapRepository;
import pl.dfurman.mountaintours.tourparticipant.tourparticipantrepository.JdbcTourParticipant;
import pl.dfurman.mountaintours.user.User;
import pl.dfurman.mountaintours.user.userrepository.JdbcUserRepository;

import java.sql.SQLException;
import java.util.List;

@Service
public class TourParticipantService {

    @Autowired
    private JdbcTourParticipant jdbcTourParticipant;

    @Autowired
    private JdbcUserRepository jdbcUserRepository;

    @Autowired
    private JdbcMapRepository jdbcMapRepository;

    public int addParticipant(Long tourId, Long participantId) throws SQLException {
        if (!jdbcMapRepository.existsById(tourId)) {
            throw new IllegalStateException(("Tour not found with id " + tourId));
        }
        if (!jdbcUserRepository.existsById(participantId)) {
            throw new IllegalStateException("User not found with id " + participantId);
        }

        return jdbcTourParticipant.addParticipant(tourId, participantId);
    }

    public int getNumberOfParticipantsForTour(Long tourId) throws SQLException{
        return jdbcTourParticipant.getNumberOfParticipantsForTour(tourId);
    }

    public boolean isParticipant(Long tourId, Long participantId) throws SQLException{
        return jdbcTourParticipant.isParticipant(tourId, participantId);
    }

    public int resignFromTour(Long tourId, Long participantId) throws SQLException{
        return jdbcTourParticipant.resignFromTour(tourId, participantId);
    }

    public List<User> getAllParticipantsInfoByTourId(Long tourId) throws SQLException {
        return jdbcTourParticipant.getAllParticipantsInfoByTourId(tourId);
    }

    public boolean isParticipantInAnyTour(Long participantId) throws SQLException {
        return jdbcTourParticipant.isParticipantInAnyTour(participantId);
    }
}
