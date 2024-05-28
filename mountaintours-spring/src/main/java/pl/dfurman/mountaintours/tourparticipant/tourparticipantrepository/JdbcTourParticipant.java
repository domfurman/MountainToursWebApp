package pl.dfurman.mountaintours.tourparticipant.tourparticipantrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;

@Repository
public class JdbcTourParticipant implements TourParticipantDAO{

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Override
    public int addParticipant(Long tourId, Long participantId) throws SQLException {
        return jdbcTemplate.update("INSERT INTO tour_participants (tour_id, participant_id) VALUES (?, ?)", tourId, participantId);
    }
}
