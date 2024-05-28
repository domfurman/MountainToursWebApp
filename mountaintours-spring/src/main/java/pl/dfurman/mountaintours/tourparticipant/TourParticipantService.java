package pl.dfurman.mountaintours.tourparticipant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dfurman.mountaintours.map.maprepository.JdbcMapRepository;
import pl.dfurman.mountaintours.tourparticipant.tourparticipantrepository.JdbcTourParticipant;
import pl.dfurman.mountaintours.user.userrepository.JdbcUserRepository;

import java.sql.SQLException;

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
}
